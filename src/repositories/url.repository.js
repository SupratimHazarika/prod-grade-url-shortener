class inMemoryUrlRepository {

  constructor(){
    this.storage = new Map()
  }

  create({id, shortCode, originalUrl}){

    this.storage.set(shortCode, {
        id, 
        shortCode,
        originalUrl
    })

    return {
        id, 
        shortCode,
        originalUrl
    }
  }

  findByShortCode(shortCode){
    return this.storage.get(shortCode) || null;
  }
}

module.exports = inMemoryUrlRepository;