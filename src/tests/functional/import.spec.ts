import mongoose from 'mongoose'
import Contact from '@/schemas/Contact'

describe('Import', () => {
  beforeAll(async () => {
    if(!process.env.MONGO_URL){
      throw new Error('MongoDB server not initialized')
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  })
  afterAll(async() => {
    await mongoose.connection.close()
  })
  beforeEach(async () => {
    await Contact.deleteMany({})
  })
  test('Should be able to import new contacts', async () => {
    await Contact.create({ email: 'any_email@mail.com'})
    const list = await Contact.find({})
    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'any_email@mail.com'
        })
      ])
    )
  })
})

