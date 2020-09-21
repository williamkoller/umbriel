import { Readable } from 'stream'
import Contact from '@/schemas/Contact'
import Tag from '@/schemas/Tag'
import csvParse from 'csv-parse'

export class ImportContactsService {
  async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
    const parsers = csvParse({
      delimiter: ';'
    })

    const parseCSV = contactsFileStream.pipe(parsers)

    const tagsData = tags.map(tag => ({
      title: tag
    }))
    const createdTags = await Tag.create(tagsData)
    const tagsIds = createdTags.map(tag => tag._id)

    parseCSV.on('data', async line => {
      const [email] = line

      await Contact.create({ email, tags: tagsIds })
    })
    await new Promise(resolve => parseCSV.on('end', resolve))
  }
}
