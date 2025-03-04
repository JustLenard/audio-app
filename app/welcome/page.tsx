import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAllSongs } from '@/lib/db/queries'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Content from './content'
import { Song } from '@/lib/db/types'

// export async function Previews() {
// 	const songs = await getAllSongs()
// 	// @ts-ignore
// 	// return <TrackTablePreview query={query} playlist={{ songs }} />
// 	return <div>Mate?</div>
// }

export default async function WelcomePage() {
	const songs = await getAllSongs()

	return <Content songs={songs} />
}
