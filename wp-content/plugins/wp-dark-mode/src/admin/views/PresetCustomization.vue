

<template>
    <Card borderless transparent class="gap-6">
        <!-- color preset customization  -->
        <Card borderless transparent class="w-full gap-6">
            <Heading bold>
                <div class="flex items-center gap-3">Preset Color Customization <Badge color="success">New</Badge>
                </div>
                <Hints>Customize the selected dark mode preset color in your way</Hints>
            </Heading>
            <div class="flex flex-wrap justify-start md:flex-nowrap">
                <Card class="w-full gap-6">
                    <!-- body colors  -->
                    <Card borderless>
                        <Heading> Body Colors <Hints>Choose the style of the floating toggle switch</Hints>
                        </Heading>
                        <div class="mt-2 border-t border-gray-100"></div>
                        <Card borderless transparent class="gap-5">
                            <Color>
                                <Heading>Body Background Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Secondary Background Color</Heading>
                            </Color>
                        </Card>
                    </Card>
                    <!-- text and link colors  -->
                    <Card borderless transparent>
                        <Heading> Text & Link Colors <Hints>Choose the style of the floating toggle switch</Hints>
                        </Heading>
                        <div class="mt-2 border-t border-gray-100"></div>
                        <Card borderless transparent class="gap-5">
                            <Color>
                                <Heading>Text Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Link Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Link Hover Color</Heading>
                            </Color>
                        </Card>
                    </Card>
                    <!-- input field colors  -->
                    <Card borderless transparent>
                        <Heading> Input Field Colors <Hints>Choose the style of the floating toggle switch</Hints>
                        </Heading>
                        <div class="mt-2 border-t border-gray-100"></div>
                        <Card borderless transparent class="gap-5">
                            <Color>
                                <Heading>Background Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Input Text Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Placeholder Color</Heading>
                            </Color>
                        </Card>
                    </Card>
                    <!-- button colors  -->
                    <Card borderless transparent>
                        <Heading> Button Colors <Hints>Choose the style of the floating toggle switch</Hints>
                        </Heading>
                        <div class="mt-2 border-t border-gray-100"></div>
                        <Card borderless transparent class="gap-5">
                            <Color>
                                <Heading>Button Text Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Button Hover Text Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Button Background Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Button Hover Background Color</Heading>
                            </Color>
                            <Color>
                                <Heading>Button Border Color</Heading>
                            </Color>
                        </Card>
                    </Card>
                </Card>
                <Card borderless class="p-6 w-fit">
                    <Preview dark />
                </Card>
            </div>
        </Card>
        <!-- scrollbar colors  -->
        <Card borderless transparent>
            <Heading bold>
                <div class="flex items-center gap-3"> Scrollbar Customization <Badge>New</Badge>
                </div>
                <Hints>Customize the scrollbar of the website in dark mode</Hints>
            </Heading>
            <!-- <div class="mt-2 border-t border-gray-100"></div> -->
            <Card class="gap-5">
                <Card borderless transparent>
                    <Toggle>
                        <Heading>Enable Dark Mode on Scrollbar</Heading>
                    </Toggle>
                    <Hints>Enable dark mode on scrollbar for cusrtoasa ds</Hints>
                </Card>
                <Color>
                    <Heading>Track Background Color</Heading>
                </Color>
                <Color>
                    <Heading>Thumb Background Color</Heading>
                </Color>
            </Card>
        </Card>
    </Card>
</template>