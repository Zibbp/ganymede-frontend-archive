import fs from 'node:fs'
import { sendStream } from 'h3'

export default defineEventHandler(event => {
    return sendStream(event, fs.createReadStream(`./node_modules/primevue/resources/themes/${event.context.params.theme}/theme.css`))
})
