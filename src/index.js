import create from './create'
import connect from './connect'
import DevTools from './DevTools'
const Dev = () => { throw new Error('<Restore.Dev /> is now <Restore.DevTools />') }
export default {create, connect, DevTools, Dev}
export {create, connect, DevTools, Dev}
