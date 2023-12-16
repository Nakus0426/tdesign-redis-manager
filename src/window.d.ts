import { type ConfigStore } from './main/configStore'
import { type RendererIpcEvents } from 'electron-events'

export interface MainWindow {
	minimize: () => void
	maximize: () => void
	unmaximize: () => void
	openSettingWindow: () => void
	openDevtools: () => void
	close: () => void
	onMinimize: (callback: () => void) => void
	onMaximize: (callback: () => void) => void
	onUnMaximize: (callback: () => void) => void
	onError: (callback: (error: any) => void) => void
	getAppTheme: () => 'light' | 'dark'
	setAppTheme: (theme: 'light' | 'dark' | 'system') => void
	getSystemLocale: () => string
	getConfig: (key: keyof ConfigStore) => any
	setConfig: (key: keyof ConfigStore, value: any) => void
	isWindows11: () => boolean

	pinia: {
		change: (key: string, value: any, isResetVersion: boolean, storeVersion: string) => void
		onChange: (callback: (key: string, value: any, isResetVersion: boolean, storeVersion: string) => void) => void
	}

	redis: {
		create: (typeof import('./utils'))['RedisUtil']['prototype']['create']
		connect: (typeof import('./utils'))['RedisUtil']['prototype']['connect']
		disconnect: (typeof import('./utils'))['RedisUtil']['prototype']['disconnect']
		destory: (typeof import('./utils'))['RedisUtil']['prototype']['destory']
		isConnected: (typeof import('./utils'))['RedisUtil']['prototype']['isConnected']
		configGet: (typeof import('./utils'))['RedisUtil']['prototype']['configGet']
		ping: (typeof import('./utils'))['RedisUtil']['prototype']['ping']
		select: (typeof import('./utils'))['RedisUtil']['prototype']['select']
		info: (typeof import('./utils'))['RedisUtil']['prototype']['info']
		keys: (typeof import('./utils'))['RedisUtil']['prototype']['keys']
		set: (typeof import('./utils'))['RedisUtil']['prototype']['set']
		hset: (typeof import('./utils'))['RedisUtil']['prototype']['hset']
		get: (typeof import('./utils'))['RedisUtil']['prototype']['get']
		del: (typeof import('./utils'))['RedisUtil']['prototype']['del']
		hdel: (typeof import('./utils'))['RedisUtil']['prototype']['hdel']
		rename: (typeof import('./utils'))['RedisUtil']['prototype']['rename']
		exists: (typeof import('./utils'))['RedisUtil']['prototype']['exists']
		expire: (typeof import('./utils'))['RedisUtil']['prototype']['expire']
		type: (typeof import('./utils'))['RedisUtil']['prototype']['type']
		ttl: (typeof import('./utils'))['RedisUtil']['prototype']['ttl']
		memoryUsage: (typeof import('./utils'))['RedisUtil']['prototype']['memoryUsage']
		srem: (typeof import('./utils'))['RedisUtil']['prototype']['srem']
		sadd: (typeof import('./utils'))['RedisUtil']['prototype']['sadd']
		onError: (callback: (id: string, error: Error) => void) => void
		onReady: (callback: (id: string) => void) => void
		onEnd: (callback: (id: string) => void) => void
		onConnect: (callback: (id: string) => void) => void
		onReconnect: (callback: (id: string) => void) => void
	}
}

export interface SettingWindow {
	minimize: () => void
	close: () => void
}

export interface ElectronAPI {
	events: RendererIpcEvents
}

export as namespace API
