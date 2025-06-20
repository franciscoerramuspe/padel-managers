import { supabase, supabaseAdmin } from '../config/supabaseClient.js'
import bcrypt from 'bcrypt'

export async function register(req, res) {
  try {
    const { email, password, first_name, last_name, phone } = req.body

    // 1) Basic signup with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name, phone }
      }
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    // Hash password before storing in users table
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 2) Create profile record with hashed password
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          password: hashedPassword,  // Store the hashed password
          first_name,
          last_name,
          phone,
        }
      ])

    if (profileError) {
      return res.status(400).json({ message: profileError.message })
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: data.user
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function logout(req, res) {
  await supabase.auth.signOut()
  res.json({ message: 'Logout successful' })
}

export async function registerAdmin(req, res) {
    const { email, password, first_name, last_name, phone } = req.body
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
            data: { 
                first_name, 
                last_name, 
                phone,  
                role: 'admin' 
            } 
        }
    })
    
    if (error) {
        return res.status(400).json({ message: error.message })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const { error: profileError } = await supabase.from('users').insert([{
        id: data.user.id,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        role: 'admin'
    }])

    if (profileError) {
        return res.status(400).json({ message: profileError.message })
    }
    
    res.status(201).json({ message: 'Admin registered successfully', user: data.user })
}

// LOGIN: signs in using email + password from Supabase
// Expects JSON body with: { email, password }
export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (loginError) {
      return res.status(401).json({ message: loginError.message })
    }

    // This token is automatically handled by Supabase,
    // but you can also return it to the client in a JSON response
    res.json({
      message: 'Login successful',
      user: loginData.user,
      session: loginData.session
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


export async function getMe(req, res) {
  try {
    // Debug the incoming authorization header
    console.log('Auth Header:', req.headers.authorization)
    
    const token = req.headers.authorization?.replace('Bearer ', '')

    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      // Log the specific error details
      console.error('Supabase Auth Error:', error)
      return res.status(401).json({ message: error.message })
    }
    
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Get additional user data from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .limit(1)
    
    if (userError) {
      console.error('User Data Error:', userError)
      return res.status(500).json({ message: userError.message })
    }
    
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: 'User profile not found' })
    }
    
    res.json(userData[0])
  } catch (err) {
    console.error('GetMe Error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function checkGoogleAuth(req, res) {
  try {
    const { email, google_id, aud, avatar_url } = req.body

    if (!email || !google_id) {
      return res.status(400).json({ 
        message: 'Email and google_id are required' 
      })
    }

    // Verify the audience claim
    if (aud !== 'authenticated') {
      return res.json({ 
        exists: false,
        message: 'Invalid authentication source'
      })
    }

    // Check if user exists in our database (case-insensitive)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ message: error.message })
    }

    // If user exists but doesn't have a profile photo and we got one from Google, update it
    if (user && avatar_url && !user.profile_photo) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_photo: avatar_url })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile photo:', updateError)
      }
    }

    if (user) {
      return res.json({
        exists: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: user.role,
          profile_photo: user.profile_photo || avatar_url // Return the Google photo if no profile photo exists
        }
      })
    }

    return res.json({ exists: false })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export async function checkEmailExists(req, res) {
  const { email } = req.body

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1)

  if (error) {
    return res.status(500).json({ message: error.message })
  }

  if (data.length > 0) {
    return res.json({ data: data[0] })
  }

  return res.json({ message: "El usuario no existe" })
}

export async function deleteUser(req, res) {
  const { id } = req.body
  
  //check if user exists
  const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', id).limit(1)
  if (userError) {
    return res.status(500).json({ message: userError.message })
  }

  if (!user || user.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }
  
  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) {
    return res.status(500).json({ message: error.message })
  }

  return res.json({ message: 'Usuario eliminado correctamente' })
}

export async function updateUser(req, res) {
  const { id, first_name, last_name, phone } = req.body

  const { error } = await supabase.from('users').update({ first_name, last_name, phone }).eq('id', id)

  if (error) {
    return res.status(500).json({ message: error.message })
  }

  return res.json({ message: 'Usuario actualizado correctamente' })
}

export async function getUserIdWithEmail(req, res) {
  const { email } = req.body

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .limit(1)

  if (error) {
    return res.status(500).json({ message: error.message })
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  return res.json({ id: data[0].id })
}

export async function registerWithGoogle(req, res) {
  try {
    const { email, password, first_name, last_name, phone, google_id, avatar_url } = req.body

    if (!google_id) {
      return res.status(400).json({ message: 'Google ID is required' })
    }

    // Check if user exists in Supabase Auth
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(google_id)
    
    if (user) {
      // Delete the existing auth user
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(google_id)
      if (deleteError) {
        return res.status(500).json({ message: deleteError.message })
      }
    }

    // Create new auth user with password and avatar_url in metadata
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        phone,
        avatar_url // Store avatar URL in user metadata
      }
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    // Create entry in users table with profile photo
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,  // Use the new auth user ID
        email,
        password: await bcrypt.hash(password, 10),
        first_name,
        last_name,
        phone,
        profile_photo: avatar_url, // Store the Google profile photo
        avatar_url: avatar_url // Store it in both fields for compatibility
      }])

    if (profileError) {
      return res.status(400).json({ message: profileError.message })
    }

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        ...data.user,
        profile_photo: avatar_url,
        avatar_url: avatar_url
      }
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ message: err.message })
  }
}

