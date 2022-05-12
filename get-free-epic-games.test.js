const epic = require('./get-free-epic-games')
const mockFile = require('./resources/mock_response.json')
const sampleFile = require('./resources/sample.json')

let games = mockFile.data.data.Catalog.searchStore.elements
let freeGame = games[0]
let nullGame1 = games[1]
let nullGame2 = games[2]
let missingGame = games[3]
let vaultedGame1 = games[4]
let vaultedGame2 = games[5]

let output = ""
let outputArr = []

beforeEach(()=> {
    output = epic.parseFreeGames(mockFile)
    outputArr = output.split("\n")
})

describe("Epic Games", ()=> {
    test('should generate correct URL for sample data', ()=> {
        let sampleOutput = epic.parseFreeGames(sampleFile)
        let sampleArr = sampleOutput.split("\n")

        let expectedString = `FREE: Jotun: Valhalla Edition at https://www.epicgames.com/store/p/jotun`
        expect(sampleArr[0]).toBe(expectedString)
    })

    test('should generate correct URL for mocked data', ()=> {
        const expectedFreeString = `FREE: ${freeGame.title} at https://www.epicgames.com/store/p/${freeGame.catalogNs.mappings[0].pageSlug}`
        expect(outputArr[0]).toBe(expectedFreeString)
    })

    test('should handle null page slug', ()=> {
        const expectedNullString = `FREE: ${nullGame1.title} at https://www.epicgames.com/store/p/${nullGame1.productSlug}`
        expect(outputArr[1]).toBe(expectedNullString)
    })

    test('should handle null string as null', () => {
        const expectedNullString = `FREE: ${nullGame2.title} at https://www.epicgames.com/store/p/${nullGame2.productSlug}`
        expect(outputArr[2]).toBe(expectedNullString)
    })

    test('should handle missing catalogNs', () => {
        const expectedString = `FREE: ${missingGame.title} at https://www.epicgames.com/store/p/${missingGame.productSlug}`
        expect(outputArr[3]).toBe(expectedString)
    })

    test('should handle vaulted games', ()=> {
        console.log(JSON.stringify(outputArr))
        expect(outputArr.length == 4)
    })
})

describe('isVaultedGame', () => {
    test('should return true when seller is dev account', () => {
        let testName = {
            "title": "test-game",
            "seller": {
                "id": "someId",
                "name": epic.epicDevTestAcct.name
            }
        }
        let testId = {
            title: "test-game",
            seller: {
                id: epic.epicDevTestAcct.id,
                name: "some-name"
            }
        }

        expect(epic.isVaultedGame(testName)).toBe(true)
        expect(epic.isVaultedGame(testId)).toBe(true)
    })

    test('should return true when category contains vaulted', () => {
        expect(epic.isVaultedGame(vaultedGame1)).toBe(true)
        expect(epic.isVaultedGame(vaultedGame2)).toBe(true)
    })

    test('should return false for other mocked games', () => {
        for (i = 0; i < 4; i++) {
            expect(epic.isVaultedGame(games[i])).toBe(false)
        }4
    })
})