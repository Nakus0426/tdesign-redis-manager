import { acceptHMRUpdate, defineStore } from 'pinia'
import { setItem, getItem } from 'localforage'
import { set, cloneDeep } from 'lodash-es'

export type Connection = {
	id: string
	name: string
	host: string
	port: number
	username: string
	password: string
	separator: string
	display: 'tree' | 'list'
	top?: boolean
	connected?: 'connecting' | 'connected' | 'disconnected'
}

export type ConnectionInfo = {
	Server?: Record<string, string>
	Clients?: Record<string, string>
	Memory?: Record<string, string>
	Persistence?: Record<string, string>
	Stats?: Record<string, string>
	Replication?: Record<string, string>
	CPU?: Record<string, string>
	Modules?: Record<string, string>
	Errorstats?: Record<string, string>
	Cluster?: Record<string, string>
	Keyspace?: Record<string, string>
}

enum ConnectionKeys {
	NormalConnections = 'normalConnections',
	TopConnections = 'topConnections',
}

/** connections store */
export const useConnectionsStore = defineStore('Connections', () => {
	/* array of connections */
	const connections = ref<Connection[]>([])

	/** get stored connections */
	async function getStoredConnections() {
		const normalConnections = await getItem<Connection[]>(ConnectionKeys.NormalConnections)
		const topConnections = await getItem<Connection[]>(ConnectionKeys.TopConnections)
		return [normalConnections || [], topConnections || []]
	}

	/** generate connections */
	function generateConnections(topConnection: Connection[], normalConnections: Connection[]) {
		document.startViewTransition(() => (connections.value = topConnection.concat(normalConnections)))
		syncConnectionConnectStatus()
	}

	/** sync connection connect status */
	function syncConnectionConnectStatus() {
		connections.value.forEach(item => {
			item.connected = window.mainWindow.redis.isConnected(item.id) ? 'connected' : 'disconnected'
		})
	}

	/** sync stored connections data */
	async function syncConnections() {
		const [normalConnections, topConnections] = await getStoredConnections()
		generateConnections(topConnections, normalConnections)
	}

	/** add connections */
	async function addConnections(connection: Connection) {
		connection = cloneDeep(connection)
		const [normalConnections, topConnections] = await getStoredConnections()
		const { name, host, port, username, password } = connection
		const isNormalExist = normalConnections.some(item => {
			const { name: _name, host: _host, port: _port, username: _username, password: _password } = item
			return name === _name || (host === _host && port === _port && username === _username && password === _password)
		})
		const isTopExist = normalConnections.some(item => {
			const { name: _name, host: _host, port: _port, username: _username, password: _password } = item
			return name === _name || (host === _host && port === _port && username === _username && password === _password)
		})
		if (isNormalExist || isTopExist) throw new Error('该连接已存在')
		connection.connected = 'disconnected'
		normalConnections.push(connection)
		const res = await setItem(ConnectionKeys.NormalConnections, normalConnections)
		if (res) generateConnections(topConnections, normalConnections)
		return connection.id
	}

	/** remove connection */
	async function removeConnection(id: string) {
		const [normalConnections, topConnections] = await getStoredConnections()
		const normalConnectionIndex = normalConnections.findIndex(item => item.id === id)
		const topConnectionIndex = topConnections.findIndex(item => item.id === id)
		if (normalConnectionIndex !== -1) {
			normalConnections.splice(normalConnectionIndex, 1)
			const res = await setItem(ConnectionKeys.NormalConnections, normalConnections)
			if (res) generateConnections(topConnections, normalConnections)
		}
		if (topConnectionIndex !== -1) {
			topConnections.splice(topConnectionIndex, 1)
			const res = await setItem(ConnectionKeys.TopConnections, topConnections)
			if (res) generateConnections(topConnections, normalConnections)
		}
		return id
	}

	/** update connection */
	async function updateConnection(connection: Connection) {
		connection = cloneDeep(connection)
		const [normalConnections, topConnections] = await getStoredConnections()
		const connectionIndex = connection.top
			? topConnections.findIndex(item => item.id === connection.id)
			: normalConnections.findIndex(item => item.id === connection.id)
		connection.top
			? topConnections.splice(connectionIndex, 1, connection)
			: normalConnections.splice(connectionIndex, 1, connection)
		const key = connection.top ? ConnectionKeys.TopConnections : ConnectionKeys.NormalConnections
		const value = connection.top ? topConnections : normalConnections
		const res = await setItem(key, value)
		if (res) generateConnections(topConnections, normalConnections)
		return connection.id
	}

	/** placing connection on top */
	async function topConnection(id: string) {
		const [normalConnections, topConnections] = await getStoredConnections()
		const connectionIndex = normalConnections.findIndex(item => item.id === id)
		const connection = normalConnections[connectionIndex]
		connection.top = true
		topConnections.push(connection)
		normalConnections.splice(connectionIndex, 1)
		const normalRes = await setItem(ConnectionKeys.NormalConnections, normalConnections)
		const topRes = await setItem(ConnectionKeys.TopConnections, topConnections)
		if (normalRes && topRes) generateConnections(topConnections, normalConnections)
	}

	/** cancel placing connection on top */
	async function cancelTopConnection(id: string) {
		const [normalConnections, topConnections] = await getStoredConnections()
		const connectionIndex = topConnections.findIndex(item => item.id === id)
		const connection = topConnections[connectionIndex]
		connection.top = false
		normalConnections.push(connection)
		topConnections.splice(connectionIndex, 1)
		const normalRes = await setItem(ConnectionKeys.NormalConnections, normalConnections)
		const topRes = await setItem(ConnectionKeys.TopConnections, topConnections)
		if (normalRes && topRes) generateConnections(topConnections, normalConnections)
	}

	/** connection connect test */
	async function connectTest(connection: Connection) {
		const id = 'test'
		try {
			const { host, port, username, password } = connection
			const url = `redis://${host}:${String(port)}`
			await window.mainWindow.redis.create({ id, url, username, password, ignoreError: true })
			await window.mainWindow.redis.connect(id)
			const testResult = await window.mainWindow.redis.ping(id)
			window.mainWindow.redis.disconnect(id)
			return testResult
		} finally {
			window.mainWindow.redis.destory(id)
		}
	}

	/** connect connection */
	async function connectConnection(id: string) {
		try {
			if (window.mainWindow.redis.isConnected(id)) return
			const connection = connections.value.find(connection => connection.id === id)
			const { host, port, username, password } = connection
			const url = `redis://${host}:${String(port)}`
			await window.mainWindow.redis.create({ id, url, username, password })
			await window.mainWindow.redis.connect(id)
		} catch (e) {
			window.mainWindow.redis.destory(id)
			throw e
		}
	}

	/** disconnect connection */
	async function disconnectConnection(id: string) {
		await window.mainWindow.redis.disconnect(id)
		handleConnectionDisconnected(id)
	}

	/** handle redis ready event */
	window.mainWindow.redis.onReady(id => {
		const connection = connections.value.find(connection => connection.id === id)
		if (!connection) return
		connection.connected = 'connected'
	})

	/** handle redis end event */
	function handleConnectionDisconnected(id: string) {
		const connection = connections.value.find(connection => connection.id === id)
		if (!connection) return
		connection.connected = 'disconnected'
	}
	window.mainWindow.redis.onEnd(handleConnectionDisconnected)

	/** handle redis connect event */
	function handleConnectionConnect(id: string) {
		const connection = connections.value.find(connection => connection.id === id)
		if (!connection) return
		connection.connected = 'connecting'
	}
	window.mainWindow.redis.onConnect(handleConnectionConnect)
	window.mainWindow.redis.onReconnect(handleConnectionConnect)

	/** get connection info */
	async function getConnectionInfo(id: string) {
		const infoStr = await window.mainWindow.redis.info(id)
		const infoArray = infoStr.split('\r\n')

		const infoTypeSign = {
			Server: false,
			Clients: false,
			Memory: false,
			Persistence: false,
			Stats: false,
			Replication: false,
			CPU: false,
			Modules: false,
			Errorstats: false,
			Cluster: false,
			Keyspace: false,
		}
		function setInfoTypeSign(type: string) {
			Object.keys(infoTypeSign).forEach(item => {
				infoTypeSign[item] = item === type
			})
		}

		const info: ConnectionInfo = {}
		for (const index in infoArray) {
			const item = infoArray[index]
			if (!item) continue
			if (item.includes('#')) {
				const type = item.substring(2)
				setInfoTypeSign(type)
				continue
			}
			Object.keys(infoTypeSign).forEach(typeKey => {
				if (infoTypeSign[typeKey]) {
					const infoItemArray = item.split(':')
					set(info, `${typeKey}.${infoItemArray[0]}`, infoItemArray[1])
				}
			})
		}
		return info
	}

	return {
		connections,
		syncConnections,
		addConnections,
		removeConnection,
		updateConnection,
		topConnection,
		cancelTopConnection,
		connectTest,
		connectConnection,
		disconnectConnection,
		getConnectionInfo,
	}
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useConnectionsStore, import.meta.hot))
