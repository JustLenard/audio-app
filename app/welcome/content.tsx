'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
// import { getAllSongs } from '@/lib/db/queries'
import { PlaylistWithSongs, Song } from '@/lib/db/types'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePlayback } from '../playback-context'
import EmailModal from './emailModel'
import { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { createUser, getAllSongs } from '@/lib/db/queries'
import Image from 'next/image'

const Content = ({ songs }: { songs: Song[] }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [user, setUser] = useState<string | null>(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setUser(localStorage.getItem('email'))
		}
	}, [])

	const { playTrack } = usePlayback()

	const handleEmailSubmit = async (email: string) => {
		await createUser(email)
		localStorage.setItem('email', email)
		setUser(email)
	}

	const playProtectedTrack = (song: Song) => {
		if (user) return playTrack(song)

		setModalOpen(true)
	}

	return (
		<div className="flex w-full flex-col bg-gradient-to-b from-black to-gray-900 text-white p-6 pb-36  md:pb-96">
			<nav className="w-full flex justify-between items-center py-4 px-6 bg-transparent absolute top-0 left-0 right-0">
				<div className="text-xl font-bold flex justify-center items-center">
					<span>
						<Image src={'/logo.jpg'} alt="Logo" width={96} height={96} />
					</span>
					<span className="pb-5">AudioErotica</span>
				</div>

				{user ? (
					<div className="md:flex items-center gap-4 hidden">
						<div className="flex items-center gap-2">
							<Avatar className="w-8 h-8">
								<AvatarFallback>{user?.charAt(0) || 'U'}</AvatarFallback>
							</Avatar>
							<span className="text-white text-sm">
								Salut, <strong>{user.split('@')[0]}</strong>!
							</span>
						</div>
					</div>
				) : (
					<Button
						className="md:block hidden text-white px-4 py-2 text-sm bg-slate-600 "
						onClick={() => setModalOpen(true)}
					>
						🔑 Autentificare
					</Button>
				)}
			</nav>

			<EmailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleEmailSubmit} />

			<div className="flex flex-col items-center justify-center flex-grow text-center pt-28 ">
				<motion.h1
					className="text-4xl md:text-7xl font-bold mb-6"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Bine ai venit la AudioErotica
				</motion.h1>
				<motion.p
					className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					Descoperă și ascultă povești senzuale, create special pentru plăcerea ta.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.5 }}
				>
					<Button
						onClick={() => playTrack(songs[0])}
						className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md bg-pink-500 hover:bg-pink-600"
					>
						Începe să asculți
					</Button>
				</motion.div>
			</div>

			<Card className="mt-10 w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 mx-auto">
				<CardContent className="p-6 text-center">
					<p className="text-gray-300 text-sm">
						Autentifică-te pentru a salva inregistrările preferate și a explora conținut exclusiv.
					</p>
				</CardContent>
			</Card>

			<div className="mt-12 w-full max-w-3xl flex flex-col justify-center mx-auto">
				<motion.h2
					className="text-2xl font-semibold mb-4"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Inregistrari recomandate
				</motion.h2>
				<motion.div
					className="space-y-4 w-full"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					{songs.map((song, index) => (
						<motion.div
							key={song.id}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 * index, duration: 0.5 }}
						>
							<Card className="p-4 bg-white/10 border border-white/20 w-full text-center flex items-center justify-between">
								<CardContent className="flex flex-col text-left">
									<p className="text-lg font-medium">{'Re-Hamatora'}</p>
									<p className="text-sm text-gray-300">{'Luna'}</p>
								</CardContent>
								<Button
									className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm"
									onClick={() => playTrack(song)}
								>
									▶ Play
								</Button>
							</Card>
						</motion.div>
					))}
					{songs.map((song, index) => (
						<motion.div
							key={song.id}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 * index, duration: 0.5 }}
						>
							<Card className="p-4 bg-white/10 border border-white/20 w-full text-center flex items-center justify-between">
								<CardContent className="flex flex-col text-left">
									<p className="text-lg font-medium">{'Re-Hamatora'}</p>
									<p className="text-sm text-gray-300">{'Luna'}</p>
								</CardContent>
								<Button
									className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm"
									onClick={() => playTrack(song)}
								>
									▶ Play
								</Button>
							</Card>
						</motion.div>
					))}
					{songs.map((song, index) => (
						<motion.div
							key={song.id}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 * index, duration: 0.5 }}
						>
							<Card className="p-4 bg-white/10 border border-white/20 w-full text-center flex items-center justify-between">
								<CardContent className="flex flex-col text-left">
									<p className="text-lg font-medium">{'Re-Hamatora'}</p>
									<p className="text-sm text-gray-300">{'Luna'}</p>
								</CardContent>
								<Button
									className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm"
									onClick={() => playProtectedTrack(song)}
								>
									▶ Play
								</Button>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	)
}

export default Content
