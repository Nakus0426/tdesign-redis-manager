<template>
	<div class="common">
		<Cell :title="t('setting.common.language.title')" direction="vertical">
			<CellItem :label="t('setting.common.language.displayLanguage.label')">
				<TSelect :options="locales" v-model="locale" auto-width @change="handleLocaleChange">
					<template #prefixIcon>
						<Icon height="16" width="16" icon="fluent:local-language-20-regular" />
					</template>
				</TSelect>
			</CellItem>
		</Cell>
		<Cell :title="t('setting.common.appUpdate.title')">
			<CellItem
				:label="t('setting.common.appUpdate.autoUpdate.label')"
				:desc="t('setting.common.appUpdate.autoUpdate.desc')"
			>
				<TSwitch size="large" />
			</CellItem>
		</Cell>
	</div>
</template>

<script setup lang="ts">
import { type SelectOption } from 'tdesign-vue-next'
import { useLocale } from '@/hooks/useLocale'
import { useAppStore } from '@/store/modules/app'
import Cell from './components/Cell.vue'
import CellItem from './components/CellItem.vue'

const appStore = useAppStore()

// app locale switch
const { t, locale } = useLocale()
const locales: SelectOption[] = [
	{ label: t('language', 1, { locale: 'zh-CN' }), value: 'zh-CN' },
	{ label: t('language', 1, { locale: 'zh-TW' }), value: 'zh-TW' },
]
function handleLocaleChange(value: string) {
	appStore.locale = value
}
</script>

<style scoped lang="scss">
.common {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--td-comp-margin-m);
}
</style>
