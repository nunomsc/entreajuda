<script setup>
import { useSocialShareStore } from './store';
import { TooltipManager } from './tooltip';
import { DEVICES } from './store';

const store = useSocialShareStore();

const t = ( key ) => window.wp_dark_mode_admin_json?.strings?.[ key ] || key;
</script>

<template>
	<!-- Manage channels -->
	<section class="w-full max-md p-3 max-w-md" v-show="store.isTab( 'channels' )">
		<!-- enable social share -->
		<div class="flex items-center justify-between mb-8">
			<label for="enable" class="font-semibold text-sm text-slate-700 cursor-pointer w-3/4">{{ t( 'social_share_inline' ) }}</label>
			<label for="enable" class="_switcher">
				<input id="enable" v-model="store.options.enable" type="checkbox" @change="store.toggleSocialShare" />
				<span></span>
			</label>
		</div>

		<!-- content -->
		<div class="w-full transition duration-150 relative" v-show="store.options.enable">
			<label class="font-semibold text-sm text-slate-700 cursor-pointer block mb-2">{{ t( 'enable_preferred_channels' ) }}</label>
			<div class="relative">
				<input
					v-model="store.state.search_channels"
					type="text"
					class="input-text text-xs"
					:placeholder="t( 'search_channel' )"
				/>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-3 fill-current cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition duration-150"
					viewBox="0 0 16 16"
					@click.prevent="store.state.search_channels = ''"
				>
					<path
						v-show="! store.state.search_channels"
						d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
					/>
					<path
						v-show="store.state.search_channels"
						d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
					/>
				</svg>
			</div>

			<!-- grid social icons -->
			<div
				v-show="store.filteredChannels.length"
				class="_social-share-container _icons-grid _max-height grid gap-3 grid-cols-2 md:grid-cols-5 mt-4 inline flex-wrap overflow-y-auto scrollbar-thin hover:scrollbar-thumb-slate-300 scrollbar-track-transparent"
			>
				<div
					v-for="channel in store.filteredChannels"
					:key="channel.id"
					class="inline-flex flex-col justify-center items-center gap-1 cursor-pointer _channels-container opacity-90 transition duration-150"
					:class="{ grayscale: ! channel.enabled || ! store.isChannelEnabled( channel.id ), 'hover:grayscale-0': channel.enabled }"
					@mouseover="channel.hover = true"
					@mouseleave="channel.hover = false"
					@click.prevent="store.toggleChannel( channel.id )"
				>
					<!-- channel icon -->
					<span
						class="text-lg w-8 h-8 pt-0.5 rounded-full text-white flex items-center justify-center _icon-svg"
						:class="[ channel.enabled && ( channel.hover || store.isChannelEnabled( channel.id ) ) ? channel.class : 'bg-gray-300' ]"
						v-html="store.getIcon( channel.id )"
					></span>
					<!-- channel name -->
					<span class="text-xs text-center text-slate-600">{{ channel.name }}</span>

					<!-- tick, visible when the channel is enabled -->
					<svg
						v-if="channel.enabled"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-current w-4"
						:class="{ 'text-blue-500': store.isChannelEnabled( channel.id ), 'opacity-10': ! store.isChannelEnabled( channel.id ) }"
						viewBox="0 0 16 16"
					>
						<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
					</svg>

					<!-- cross, visible when the channel is disabled -->
					<svg v-else xmlns="http://www.w3.org/2000/svg" class="fill-current w-4 text-slate-300" viewBox="0 0 16 16">
						<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
					</svg>
				</div>
			</div>

			<div v-show="! store.filteredChannels.length" class="text-slate-400 text-center mt-4">
				{{ t( 'not_found' ) }} <span class="italic text-blue-500">{{ store.state.search_channels }}</span>
			</div>

			<!-- channel footer buttons -->
			<div class="flex flex-between gap-3 my-6 justify-center text-xs">
				<!-- show all button -->
				<a
					href="javascript:;"
					class="bg-transparent px-2 py-1 rounded-sm font-medium focus:outline-none text-blue-400 hover:ring-blue-600 ring-1 ring-blue-500 focus:text-blue-500 hover:bg-blue-50 inline-flex items-center gap-1 transition duration-150"
					@click.prevent="store.state.showAllChannels = ! store.state.showAllChannels"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="fill-current w-3 transition duration-300"
						:class="{ 'rotate-180': store.state.showAllChannels }"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
						/>
					</svg>
					<span>{{ store.state.showAllChannels ? ' ' + t( 'see_less_channels' ) : ' ' + t( 'see_more_channels' ) }}</span>
				</a>

				<!-- Unlock button -->
				<a
					v-show="store.hasLockedChannels"
					href="javascript:;"
					class="bg-red-50 px-2 py-1 rounded-sm font-medium focus:outline-none focus:ring-red-400 text-red-600 ring-1 ring-red-200 hover:text-red-400 hover:opacity-75 transition duration-150"
					@click.prevent="store.showPromo"
				>
					{{ t( 'unlock_all_channels' ) }}
				</a>
			</div>

			<!-- manage channels -->
			<div class="mt-8">
				<label class="font-semibold text-sm text-slate-700 cursor-pointer mb-2 flex gap-2">
					{{ t( 'manage_channels' ) }}
					<span v-tooltip class="wpdarkmode-tooltip" :title="t( 'manage_channels_tooltip' )"></span>
				</label>

				<!-- manage channels; sortable, editable -->
				<div class="flex flex-col gap-2" dropzone="true">
					<div
						v-for="channel in store.enabledChannels"
						:key="channel.id"
						class="flex flex-col gap-2 w-fit relative"
						dropzone="true"
						draggable="true"
						:class="`_channel-${ channel.id }`"
						@dragstart="store.state.draggingChannel = channel.id"
						@dragenter="store.handleDrag( $event, channel.id )"
						@dragend="store.handleDrop( $event, channel.id )"
					>
						<div class="w-full cursor-pointer _social-share-container inline" tabindex="0">
							<!-- move icon -->
							<span
								tabindex="1"
								class="text-slate-200 transition duration-100 h-full flex items-center justify-center text-2xl cursor-grab"
								:class="{ 'text-blue-600': store.state.draggingChannel === channel.id }"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-8" viewBox="0 0 16 16">
									<path
										fill-rule="evenodd"
										d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
									/>
								</svg>
							</span>

							<!-- channel name -->
							<div class="flex items-center bg-slate-200 _channel-name group">
								<div
									class="bg-slate-600 text-white h-10 w-10 flex items-center justify-center text-base _icon-svg flex-shrink-0"
									:class="`_icon-${ channel.id }`"
									v-html="store.getIcon( channel.id )"
								></div>
								<div class="flex w-28 items-center gap-2 relative">
									<!-- editable name -->
									<div
										v-editable="channel.name"
										class="text-sm w-full pl-3 font-medium flex items-center focus:outline-none transition duration-100 focus:ring focus:ring-blue-400 h-8 overflow-hidden text-ellipsis whitespace-nowrap"
										contenteditable="true"
										@blur="channel.name = $event.target.innerText"
									></div>
									<!-- pencil icon -->
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="fill-current w-3 absolute right-2.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:!opacity-0 transition-opacity duration-200"
										viewBox="0 0 16 16"
										@click.prevent="store.editableChannel( $event )"
									>
										<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
									</svg>
								</div>
							</div>

							<!-- AI channels Prompt -->
							<span
								v-if="store.isAIChannel( channel.id )"
								class="bg-slate-200 h-10 w-24 flex items-center justify-center text-xs transition duration-200 cursor-pointer"
								@click.prevent="store.editPrompt( channel )"
								@mouseenter="TooltipManager.show( 'Edit AI prompt', $event )"
								@mouseleave="TooltipManager.hide()"
							>
								<div class="bg-gray-50 hover:bg-blue-50 px-3 py-1.5 flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 shadow-sm transition-all duration-200 group">
									<span class="text-xs text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Prompt</span>
									<svg class="w-3 h-3 ml-1 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
									</svg>
								</div>
							</span>

							<!-- visibility: mobile -->
							<span
								class="bg-slate-200 h-10 w-11 flex items-center justify-center text-base transition duration-100 cursor-pointer"
								:class="channel.visibility?.mobile ? [ 'text-blue-500' ] : [ 'text-slate-300' ]"
								@click.prevent="channel.visibility.mobile = ! channel.visibility.mobile"
								@mouseenter="TooltipManager.show( 'Hide/Show on Mobile', $event )"
								@mouseleave="TooltipManager.hide()"
								v-html="DEVICES.mobile.icon"
							></span>

							<!-- visibility: desktop -->
							<span
								class="bg-slate-200 h-10 w-11 flex items-center justify-center text-base transition duration-100 cursor-pointer"
								:class="channel.visibility?.desktop ? [ 'text-blue-500' ] : [ 'text-slate-300' ]"
								@click.prevent="channel.visibility.desktop = ! channel.visibility.desktop"
								@mouseenter="TooltipManager.show( 'Hide/Show on PC/Laptop', $event )"
								@mouseleave="TooltipManager.hide()"
								v-html="DEVICES.desktop.icon"
							></span>

							<!-- unselect channel -->
							<span
								class="bg-slate-200 text-slate-400 hover:text-red-600 transition duration-150 h-10 w-11 flex items-center justify-center text-base cursor-pointer"
								@click.prevent="store.toggleChannel( channel.id )"
								@mouseenter="TooltipManager.show( 'Delete', $event, 'right' )"
								@mouseleave="TooltipManager.hide()"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current w-6">
									<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
								</svg>
							</span>
						</div>

						<!-- sort dropzone -->
						<div
							v-if="store.state.draggingChannel && store.state.draggingChannel === channel.id"
							class="h-full w-full absolute bg-white shadow z-20 ring rounded-sm ring-blue-400 flex items-center justify-center text-center font-semibold tracking-wider"
							draggable="true"
						>
							Drop here
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Prompt Edit Modal -->
		<div
			v-show="store.state.promptModal.show"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			@click.self="store.closePromptModal()"
		>
			<div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
				<!-- Close X button -->
				<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150" @click="store.closePromptModal()">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>

				<!-- Modal Header -->
				<div class="mb-4">
					<h3 class="text-xl font-semibold text-gray-900">{{ t( 'edit_prompt' ) }}</h3>
					<p class="text-sm text-gray-600 mt-2">
						{{ t( 'customize_prompt_desc_1' ) }} <span class="font-medium">{{ store.state.promptModal.channel?.name }}</span> {{ t( 'customize_prompt_desc_2' ) }}
					</p>
				</div>

				<!-- Prompt Textarea with Free/Pro Logic -->
				<div class="mb-4 relative">
					<!-- Textarea with its own group for hover -->
					<div class="group/textarea relative">
						<textarea
							v-model="store.state.promptModal.prompt"
							class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							:class="{ 'group-hover/textarea:opacity-50 bg-gray-100 text-gray-500 cursor-not-allowed': store.isFree }"
							:disabled="store.isFree"
							:placeholder="t( 'default_ai_prompt' )"
							@input="store.updateChannelPrompt()"
						></textarea>

						<!-- Upgrade Button on Textarea Hover Only (Free Version Only) -->
						<div
							v-show="store.isFree"
							class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/textarea:opacity-100 transition-all duration-300 pointer-events-none group-hover/textarea:pointer-events-auto"
						>
							<button
								class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 pointer-events-auto group/btn"
								@click.prevent="store.showPromo()"
							>
								<div class="flex items-center space-x-2">
									<!-- Lock Icon (smaller) -->
									<div class="relative">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
										<!-- Small indicator dot -->
										<div class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
									</div>
									<span class="text-sm font-bold">{{ t( 'upgrade_now' ) }}</span>
									<!-- Chevron with hover animation (smaller) -->
									<svg class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</button>
						</div>
					</div>

					<!-- Available Variables -->
					<div class="mt-3 text-xs" :class="store.isFree ? 'text-gray-400' : 'text-gray-500'">
						<span class="font-medium">{{ t( 'available_variables' ) }}</span>
						<span class="ml-1">{page_title}, {page_url}, {site_name}, {site_url}, {language}</span>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-between items-center">
					<!-- Reset Button -->
					<button
						class="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium transition-all duration-200"
						:class="{
							'opacity-50 cursor-not-allowed hover:cursor-not-allowed': store.isFree,
							'hover:bg-red-50 hover:text-red-600 hover:border-red-300 group hover:cursor-pointer': ! store.isFree,
						}"
						:disabled="store.isFree"
						@click="store.isFree ? store.showPromo() : store.resetToDefault()"
					>
						<svg
							class="w-3.5 h-3.5"
							:class="{ 'transition-transform group-hover:rotate-180 duration-300': ! store.isFree }"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						<span style="margin-left: 5px">{{ t( 'reset_to_default' ) }}</span>
					</button>

					<!-- Done Button -->
					<button
						class="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
						:class="{ 'opacity-50 cursor-not-allowed hover:cursor-not-allowed': store.isFree, 'group hover:cursor-pointer': ! store.isFree }"
						:disabled="store.isFree"
						style="transition: all 0.2s"
						@click="store.isFree ? store.showPromo() : store.donePrompt()"
						@mouseenter="! store.isFree && ( $event.target.style.backgroundColor = 'rgb(59 130 246)', $event.target.style.color = 'white', $event.target.style.borderColor = 'rgb(59 130 246)' )"
						@mouseleave="! store.isFree && ( $event.target.style.backgroundColor = 'rgb(249 250 251)', $event.target.style.color = 'rgb(75 85 99)', $event.target.style.borderColor = 'rgb(229 231 235)' )"
					>
						<span>{{ t( 'done' ) }}</span>
					</button>
				</div>
			</div>
		</div>
	</section>
</template>
