// Temporary Step 11 check — delete after running. Calls OMDb only; no database.
import { searchTitles, getById } from '../clients/omdb.js';
import { ProgramType } from '../constants/enums.js';

const INCEPTION = 'tt1375666';
const GAME_OF_THRONES = 'tt0944947';
const GOT_FIRST_EPISODE = 'tt1480055';
const NON_EXISTENT_ID = 'tt0000000';

console.log('1. Movie detail:', await getById(INCEPTION));
console.log('2. Series detail:', await getById(GAME_OF_THRONES));
console.log('3. Episode discarded:', await getById(GOT_FIRST_EPISODE));
console.log('4. Unknown id:', await getById(NON_EXISTENT_ID));

const results = await searchTitles('batman', ProgramType.MOVIE);
console.log(`5. Search "batman" → ${results.length} results. First 2:`, results.slice(0, 2));
console.log('6. Search with no matches:', await searchTitles('zzqqxxnotarealtitle', ProgramType.MOVIE));
