// TODO: handle the command, parsing the cli params and using StatRepository
const parseArgCsv = (arg) => arg.split(',').map(x => x.trim()).filter(x => !!x);
