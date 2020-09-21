import mongoose from 'mongoose'
import Contact from '@/schemas/Contact'
import { Readable } from 'stream'
import Tag from '@/schemas/Tag'
import { ImportContactsService } from './import-contacts'

describe('Import', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized')
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  })
  afterAll(async () => {
    await mongoose.connection.close()
  })
  beforeEach(async () => {
    await Contact.deleteMany({})
  })
  test('Should be able to import new contacts', async () => {
    const contactFileStream = Readable.from([
      'williamkoller@gmail.com\n',
      'developkoller@gmail.com\n'
    ])

    const importsContacts = new ImportContactsService()
    await importsContacts.run(contactFileStream, ['Students', 'Class A'])
    const createdTags = await Tag.find({})

    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' })
    ])

    const createdTagsIds = createdTags.map(tag => tag._id)
    const createdContacts = await Contact.find({})

    expect(createdContacts).toEqual([
      expect.objectContaining({
        email: 'williamkoller@gmail.com',
        tags: createdTagsIds
      }),
      expect.objectContaining({
        email: 'developkoller@gmail.com',
        tags: createdTagsIds
      })
    ])
  })
})

