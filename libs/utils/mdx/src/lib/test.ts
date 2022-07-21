import { aaa } from './badFindAll'
import { getAllBacklinks, getAllLinkedTexts } from './getAllLinkedTexts'
;(async () => {
  console.log(
    JSON.stringify(await aaa({ directory: '../../../../../apps/zkp/public/notes' }), null, 2),
  )
})()
