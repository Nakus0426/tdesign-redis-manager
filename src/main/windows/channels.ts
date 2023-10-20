export const channel = {
	main: {
		// window operations
		minimize: 'main:minimize',
		maximize: 'main:maximize',
		unmaximize: 'main:unmaximize',
		openSetting: 'main:openSetting',
		openDevtools: 'main:openDevtools',
		close: 'main:close',
		onMinimize: 'main:onMinimize',
		onMaximize: 'main:onMaximize',
		onUnmaximize: 'main:onUnmaximize',
		onError: 'main:onError',
		// app operations
		getAppTheme: 'main:getAppTheme',
		setAppTheme: 'main:setAppTheme',
		getSystemLocale: 'main:getSystemLocale',
		getMicaConfig: 'main:getMicaConfig',
		setMicaConfig: 'main:setMicaConfig',
		isWindows11: 'main:isWindows11',
		// pinia operations
		pinia: {
			change: 'main:pinia:change',
			onChange: 'main:pinia:onChange',
		},
		//redis operations
		redis: {
			create: 'main:redis:create',
			connect: 'main:redis:connect',
			disconnect: 'main:redis:disconnect',
			destory: 'main:redie:destory',
			isConnected: 'main:redis:isConnected',
			ping: 'main:redis:ping',
			configGet: 'main:redis:configGet',
			select: 'main:redis:select',
			info: 'main:redis:info',
			keys: 'main:redis:keys',
			set: 'main:redis:set',
			get: 'main:redis:get',
			del: 'main:redis:del',
			rename: 'main:redis:rename',
			exists: 'main:redis:exists',
			expire: 'main:redis:expire',
			type: 'main:redis:type',
			ttl: 'main:redis:ttl',
			onError: 'main:redis:onError',
			onReady: 'main:redis:onReady',
			onEnd: 'main:redis:onEnd',
			onConnect: 'main:redis:onConnect',
			onReconnect: 'main:redis:onReconnect',
		},
	},
	setting: {
		// window operations
		minimize: 'setting:minimize',
		close: 'setting:close',
	},
}
