// TODO: handle the command, parsing the cli params and using StatRepository
const selectFields = select.split(',').map(x => x.trim()).filter(x => !!x);