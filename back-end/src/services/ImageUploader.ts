import multer from "multer"

const storage = multer.diskStorage({

	destination: (req, file, cb) => {
		let folder = req.url.split("/")[1]
		cb(null, `public/image/${folder}/`)
	},
	filename: (req, file, cb) => {
		cb(null, "photo-" + Date.now() + ".jpg")
	},
})

export const uploadImage = multer({ storage }).single("image")
