
const { ObjectId } = require('mongodb');

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection('contacts');
    }

    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        // Remove undefined fields
        Object.keys(contact).forEach((key) => {
            if(contact[key] === undefined) delete contact[key];
        });

        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { 
                $set: { favorite: contact.favorite === true }
            },
            {
                returnDocument: 'after',
                upsert: true
            },
        );

        return result;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name : {
                $regex: new RegExp(new RegExp(name)),
                $options: "i", // case-insensitive regular expressions
            }
        });
    }

    async findByID(id) {
        return await this.Contact.findOne({
            // Deprecated way
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findFavorite() {
        return this.find({
            favorite: true,
        });
    }


    async update(id, payload) {
        const filter = {
            // Deprecated way
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const updateData = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            {
                $set: updateData,
            },
            {
                returnDocument: 'after',
            },
        );

        return result;
    }

    async delete(id) {
        const result = this.Contact.findOneAndDelete({
            // Deprecated way
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ContactService;
