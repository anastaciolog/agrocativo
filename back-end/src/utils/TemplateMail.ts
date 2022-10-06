import { format } from "date-fns"

export default class TemplateMail {

  private code?: string
  private name?: string
  private ip?: string
  private dateTime: string

  constructor(code?: string, name?: string, ip?: string) {
    this.code = code
    this.name = name
    this.ip = ip
    this.dateTime = format(new Date(), 'MM-dd-yyyy HH:mm:ss')
  }

  header() {
    return `
    <!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <!--[if mso]>
            <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
            <style>
              td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
            </style>
          <![endif]-->
    <title>Lure</title>
    <link
        href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
        rel="stylesheet" media="screen">
    <style>
        .hover-underline:hover {
            text-decoration: underline !important;
        }

        @media (max-width: 600px) {
            .sm-leading-32 {
                line-height: 32px !important;
            }

            .sm-px-24 {
                padding-left: 24px !important;
                padding-right: 24px !important;
            }

            .sm-py-32 {
                padding-top: 32px !important;
                padding-bottom: 32px !important;
            }

            .sm-pt-32 {
                padding-top: 32px !important;
            }

            .sm-pb-24 {
                padding-bottom: 24px !important;
            }

            .sm-w-full {
                width: 100% !important;
            }
        }
    </style>
</head>

<body
    style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; --bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity));">

    <div role="article" aria-roledescription="email" aria-label="Default email title" lang="en">
        <table style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; width: 100%;" width="100%"
            cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td align="center"
                    style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;"
                    bgcolor="rgba(236, 239, 241, var(--bg-opacity))">
                    <table class="sm-w-full" style="font-family: 'Montserrat',Arial,sans-serif; width: 600px;"
                        width="600" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                            <td class="sm-pt-32 sm-pb-24 sm-px-24"
                                style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; text-align: center;"
                                align="center">
                                <p style="font-weight: 700; font-size: 22px; margin-top: 0; --text-opacity: 1; color: #008036;">
                                AgroCATIVO</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" class="sm-px-24" style="font-family: 'Montserrat',Arial,sans-serif;">
                                <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                    cellpadding="0" cellspacing="0" role="presentation">
    `
  }

  footer() {
    return `
    <tr>
    <td
        style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 12px; padding: 48px; --text-opacity: 1; color: #eceff1; color: rgba(236, 239, 241, var(--text-opacity));text-align: center">

        <p
            style="--text-opacity: 1; color: #263238; color: rgba(38, 50, 56, var(--text-opacity)); margin-bottom: 48px;">
            Ao utilizar a plataforma AgroCATIVO entendemos que você está ciente e aceita os
            <a href="" class="hover-underline"
                style="--text-opacity: 1; color: #7367f0; text-decoration: none;">Termos
                de Uso</a> e
            <a href="" class="hover-underline"
                style="--text-opacity: 1; color: #7367f0; text-decoration: none;">Políticas de Privacidade</a>.
        </p>
    </td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</div>
</body>

</html>
    `
  }

  register() {
    return `${this.header()}
                          <tr>
                            <td class="sm-px-24"
                              style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, var(--bg-opacity)); border-radius: 20px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #008036"
                              bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
                              <p style="font-weight: 600; margin-bottom: 0;">Olá,</p>
                              <p style="font-weight: 700; font-size: 22px; margin-top: 0; --text-opacity: 1; color: #008036;">
                                ${this.name}!</p>
                                
                              <p class="sm-leading-32"
                                style="font-weight: 600; margin: 0 0 24px; --text-opacity: 1; color: #008036">
                                Seja bem vindo(a)!
                              </p>

                              <p style="margin: 24px 0;">
                                Seu código de ativação é:
                              </p>

                              <p
                                style=" border-radius: 5px;width: 150px; margin: 24px 0;font-weight: 600;font-size: 24px;letter-spacing: 5px;color: #f2f2f2;padding:12px;background-color: #008036;text-align: center;">
                                ${this.code}
                              </p>                             
        
                              <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <td
                                    style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 20px; padding-bottom: 20px;">
                                    <div
                                      style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); height: 1px; line-height: 1px;">
                                      &zwnj;</div>
                                  </td>
                                </tr>
                              </table>
        
                              <p style="margin: 0 0 16px;">Saudações, <br>Equipe AgroCATIVO.</p>
                            </td>
                          </tr>
                       ${this.footer()}  `
  }

  newCode() {
    return `${this.header()}
                          <tr>
                            <td class="sm-px-24"
                              style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, var(--bg-opacity)); border-radius: 20px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #008036"
                              bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
                              <p style="font-weight: 600; margin-bottom: 0;">Olá,</p>
                              <p style="font-weight: 700; font-size: 22px; margin-top: 0; --text-opacity: 1; color: #008036;">
                                ${this.name}!</p>
                                
                                <p style="margin: 24px 0;">
                                Se você não <span style="font-weight: 600;">reconhece essa ação</span> NÃO UTILIZE divulgue esse código.
                              </p>
          
            

                              <p style="margin: 24px 0;">
                                Seu código de ativação é:
                              </p>

                              <p
                                style=" border-radius: 5px;width: 150px; margin: 24px 0;font-weight: 600;font-size: 24px;letter-spacing: 5px;color: #f2f2f2;padding:12px;background-color: #008036;text-align: center;">
                                ${this.code}
                              </p>     

                            <p style="margin: 24px 0;">
                                  IP: <br> <br> IP address: <span style="font-weight: 600;">${this.ip}</span> <br> Data: <span style="font-weight: 600;">${this.dateTime}</span>
                                </p>
                              <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <td
                                    style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 20px; padding-bottom: 20px;">
                                    <div
                                      style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); height: 1px; line-height: 1px;">
                                      &zwnj;</div>
                                  </td>
                                </tr>
                              </table>
        
                              <p style="margin: 0 0 16px;">Saudações, <br>Equipe AgroCATIVO.</p>
                            </td>
                          </tr>
                       ${this.footer()}  `
  }

  resetPassword() {
    return `${this.header()}
                          <tr>
                            <td class="sm-px-24"
                              style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, var(--bg-opacity)); border-radius: 20px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #008036"
                              bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
                              <p style="font-weight: 600; margin-bottom: 0;">Olá!</p>
                              <p class="sm-leading-32"
                                style="font-weight: 600; margin: 0 0 24px; --text-opacity: 1; color: #008036">
                                Senha redefinida com sucesso! 🤩
                              </p>

                              <p style="margin: 24px 0;">
                              Se você não <span style="font-weight: 600;">reconhece essa ação</span> envie um email para  <a href="mailto:contato@agrocativo.com.br" class="hover-underline"
                              style="--text-opacity: 1; color: #7367f0; text-decoration: none;">contato@agrocativo.com.br</a>
                            </p>
        
                              <p style="margin: 24px 0;">
                                IP: <br> <br> IP address: <span style="font-weight: 600;">${this.ip}</span> <br> Data: <span style="font-weight: 600;">${this.dateTime}</span>
                              </p>
        
                              <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <td
                                    style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 20px; padding-bottom: 20px;">
                                    <div
                                      style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); height: 1px; line-height: 1px;">
                                      &zwnj;</div>
                                  </td>
                                </tr>
                              </table>
        
                              <p style="margin: 0 0 16px;">Saudações, <br>Equipe AgroCATIVO.</p>
                            </td>
                          </tr>
                      ${this.footer()}   `
  }

  forgotPassword() {
    return `${this.header()}
                          <tr>
                            <td class="sm-px-24"
                              style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, var(--bg-opacity)); border-radius: 20px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #008036"
                              bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
                              <p style="font-weight: 600; margin-bottom: 0;">Olá!</p>
                              <p class="sm-leading-32"
                                style="font-weight: 600; margin: 0 0 24px; --text-opacity: 1; color: #008036">
                                Esqueceu a senha? Sem problemas!
                              </p>
        
                              <p style="margin: 24px 0;">
                                Se você <span style="font-weight: 600;">reconhece essa ação</span> use o código abaixo para redefinir sua senha.
                              </p>
                              <p style="margin: 24px 0;">
                                Seu código para redefinição de senha é:
                              </p>
                              <p
                                style=" border-radius: 5px;width: 150px; margin: 24px 0;font-weight: 600;font-size: 24px;letter-spacing: 5px;color: #f2f2f2;padding:12px;background-color: #008036;text-align: center;">
                                ${this.code}
                              </p>
                              <p style="margin: 24px 0;">
                                <span style="font-weight: 600;">Importante: </span>O código é válido por 1 hora a partir da sua solicitação.
                              </p>
                              <p style="margin: 24px 0;">
                                ⚠️ Não compartilhe este código com ninguém.
                              </p>
        
                              <p style="margin: 24px 0;">
                                IP: <span style="font-weight: 600;">${this.ip}</span> <br> Data: <span style="font-weight: 600;">${this.dateTime}</span>
                              </p>
        
                              <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <td
                                    style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 20px; padding-bottom: 20px;">
                                    <div
                                      style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); height: 1px; line-height: 1px;">
                                      &zwnj;</div>
                                  </td>
                                </tr>
                              </table>
        
                              <p style="margin: 0 0 16px;">Saudações, <br>Equipe AgroCATIVO.</p>
                            </td>
                          </tr>
                       ${this.footer()}   `
  }

  accountDeactivated() {
    return `${this.header()}
                          <tr>
                            <td class="sm-px-24"
                              style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, var(--bg-opacity)); border-radius: 20px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #008036"
                              bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
                              <p style="font-weight: 600; margin-bottom: 0;">Olá!</p>
                              <p class="sm-leading-32"
                                style="font-weight: 600; margin: 0 0 24px; --text-opacity: 1; color: #008036">
                                Sua conta está desativada! 😔
                              </p>
        
                              <p>Sua conta está desativada por um dos motivos:</p>
                              <ul style="margin-bottom: 24px;">
                                <li>Você solicitou a desativação da sua conta.</li>
                                <li>Detectamos que houve violações nas Políticas de Privacidade ou Termos de Uso.</li>
                              </ul>
                              <p style="margin: 24px 0;">
                                Se você acredita que houve um equívoco de nossa parte entre em contato pelo email
                                <a href="mailto:contato@agrocativo.com.br" class="hover-underline"
                                  style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">contato@agrocativo.com.br</a>
                              </p>
        
                              <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                                cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                  <td
                                    style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 20px; padding-bottom: 20px;">
                                    <div
                                      style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); height: 1px; line-height: 1px;">
                                      &zwnj;</div>
                                  </td>
                                </tr>
                              </table>
                              <p style="margin: 0 0 16px;">Saudações, <br>Equipe AgroCATIVO.</p>
                            </td>
                          </tr>
                     ${this.footer()}    `
  }

}