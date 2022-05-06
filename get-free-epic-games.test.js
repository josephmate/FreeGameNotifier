const epic = require('./get-free-epic-games')
const mockFile = require('./resources/mock_response.json')
const sampleFile = require('./resources/sample.json')

let games = mockFile.data.data.Catalog.searchStore.elements
let freeGame = games[0]
let nullGame = games[1]
let missingGame = games[2]

let output = ""
let outputArr = []

beforeEach(()=> {
    output = epic.parseFreeGames(mockFile)
    outputArr = output.split("\n")
})

describe("Epic Games", ()=> {
    test('should generate correct URL for sample data', ()=> {
        let expectedString = "FREE: Terraforming Mars at https://www.epicgames.com/store/p/terraforming-mars-18c3ad"

        let sampleOutput = epic.parseFreeGames(sampleFile)
        let sampleArr = sampleOutput.split("\n")
        expect(sampleArr[0]).toBe(expectedString)
    })

    test('should generate correct URL for mocked data', ()=> {
        const expectedFreeString = `FREE: ${freeGame.title} at https://www.epicgames.com/store/p/${freeGame.catalogNs.mappings[0].pageSlug}`
        expect(outputArr[0]).toBe(expectedFreeString)
    })

    test('should handle null page slug', ()=> {
        const expectedNullString = `FREE: ${nullGame.title} at https://www.epicgames.com/store/p/${nullGame.productSlug}`
        expect(outputArr[1]).toBe(expectedNullString)
    })

    test('should handle missing catalogNs', () => {
        const expectedString = `FREE: ${missingGame.title} at https://www.epicgames.com/store/p/${missingGame.productSlug}`
        expect(outputArr[2]).toBe(expectedString)
    })
})