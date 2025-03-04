import { ChangeEvent, MouseEventHandler, useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (email: string) => void
}

function isValidEmail(email: string): boolean {
	return /\S+@\S+\.\S+/.test(email)
}

const EmailModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
	const [email, setEmail] = useState('')
	const [error, setError] = useState(false)

	const handleSubmit = () => {
		if (isValidEmail(email)) {
			onSubmit(email)
			onClose()
			setError(false)
		} else {
			setError(true)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold text-center">Introdu adresa ta de email</DialogTitle>
				</DialogHeader>
				<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
					<p className="text-gray-300 text-sm text-center mb-4">
						Introdu adresa ta de email pentru a asculta mai multe povești senzuale.
					</p>
					<Input
						placeholder="Emailul tău"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
						onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
					/>
					{error && <div className="text-red-600">Please use a valid email</div>}
					<Button
						type="submit"
						onClick={handleSubmit}
						className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md"
					>
						Trimite
					</Button>
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}

export default EmailModal
