import { Schema, arrayOf } from 'normalizr'

const talkSchema = new Schema('talks', {idAttribute: 'id'})
const messageSchema = new Schema('messages', {idAttribute: 'ts'})
const userSchema    = new Schema('user', {idAttribute: 'id'})

messageSchema.define({
  talk: talkSchema
})

const Schemas = {
  talk: talkSchema,
  talkArray: arrayOf(talkSchema),
  message: messageSchema,
  messageArray: arrayOf(messageSchema),
  userArray: arrayOf(userSchema)
}
export default Schemas
