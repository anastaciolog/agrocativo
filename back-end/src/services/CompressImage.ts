const fs = require('fs'),
    sharp = require('sharp');

export async function compressImage(file: any, size: number): Promise<any> {

    await sharp(file.path)
        .resize(size)
        .toFormat('jpg')
        .jpeg({
            quality: 75
        })
        .toBuffer()
        .then(async (data: any) => {
                //Armazena o buffer no novo caminho
                fs.writeFile(file.path, data, (err: any) => {
                    if (err) {
                        // Aqui um erro significa que o upload falhou, então é importante que o usuário saiba.
                        throw err;
                    }
                })
        })

    // Se o código chegou até aqui, deu tudo certo, então vamos retornar o novo caminho
    return file.path
}