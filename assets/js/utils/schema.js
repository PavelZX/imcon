import { normalize, schema } from 'normalizr'

const talkSchema = new schema.Entity('talks', {idAttribute: 'id'})
const messageSchema = new schema.Entity('messages', {idAttribute: 'ts'})
const userSchema    = new schema.Entity('user', {idAttribute: 'id'})

messageSchema.define({
  talk: talkSchema
})

const Schemas = {
  talk: talkSchema,
  talkArray: normalize([talkSchema]),
  message: messageSchema,
  messageArray: normalize([messageSchema]),
  userArray: normalize([userSchema])
}
export default Schemas
