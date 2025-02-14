import { useState } from 'react'
import { FormData, TournamentInfo } from '@/types/tournament'

export const useTournamentForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category_ids: [],
    start_date: "",
    end_date: "",
    status: "upcoming",
  })

  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo>({
    description: "",
    rules: "",
    tournament_location: "",
    tournament_address: "",
    tournament_club_name: "",
    signup_limit_date: "",
    inscription_cost: 0,
    first_place_prize: "",
    second_place_prize: "",
    third_place_prize: "",
    tournament_thumbnail: undefined,
    courts_available: [],
    time_slots: []
  })

  return {
    formData,
    setFormData,
    tournamentInfo,
    setTournamentInfo
  }
} 