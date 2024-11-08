const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

async function fetchArabicText(surah, ayah) {
    try {
        const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${surah}:${ayah}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
    }
  
    const json = await response.json()
    return json.verses[0].text_uthmani
    } catch (error) {
        console.error(error.message)
    }
}

async function fetchEnglishText(surah, ayah) {
    try {
        const response = await fetch(`https://api.quran.com/api/v4/quran/translations/203?verse_key=${surah}:${ayah}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
    }
  
    const json = await response.json()
    return json.translations[0].text.replace(/<sup[^>]*>.*?<\/sup>/g, "")
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("quran")
		.setDescription("Gets a portion of the Qur'an")
		.addSubcommand(subcommand =>
			subcommand
				.setName("ayah")
				.setDescription("Gets a single Ayah from the Qur'an")
				.addStringOption(option =>
					option.setName("surah")
						.setDescription("The Surah to get the Ayah from")
						.setRequired(true)
						.addChoices(
							{ name: "Al Fatihah", value: "1" },
						)
				)
				.addIntegerOption(option =>
					option.setName("ayah")
						.setDescription("The Ayah to get in the Surah")
						.setRequired(true)
				),
			),
	async execute(interaction) {
		let options = interaction.options

		let surah = options.getString("surah")
		let ayah = options.getInteger("ayah")

		let arabicText = await fetchArabicText(surah, ayah)
		let englishText = await fetchEnglishText(surah, ayah)

		const ayahEmbed = new EmbedBuilder()
			.setColor("#10b981")
			.setAuthor({
				name: `Quran - Surah ${surah} Ayah ${ayah}`
			  })
			  .setTitle(arabicText)
			  .setDescription(englishText)
			  .setTimestamp()

		await interaction.reply({ embeds: [ayahEmbed] })
	},
}