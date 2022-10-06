import multer from "multer"
import fs from "fs"

const storage = multer.diskStorage({

	destination: (req, file, cb) => {
		let dest = `public/file/${req.params.id}`
		if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
		cb(null, dest)
	},
	filename: (req, file, cb) => {
		let newName = file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		newName = newName.replace(' ','').toLowerCase();
		cb(null, `${req.params.type}_${newName}`)
	}
})

export const uploadFile = multer({ storage }).single("file")
