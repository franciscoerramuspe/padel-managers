import { PencilIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { TournamentEditForm } from './TournamentEditForm'
import { Tournament } from '../../app/tournaments/[id]/page'

type Props = {
  tournament: Tournament
}

export function TournamentEditButton({ tournament }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
      >
        <PencilIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <TournamentEditForm
          tournament={tournament}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 