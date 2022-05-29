//! require ( const const const const const )
require("dotenv/config");
const avaliableItems = 16;
const { createClient } = require("@supabase/supabase-js");
const RawItems = [];
const SellableItems = [];

const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
	autoRefreshToken: true,
	persistSession: true,
	detectSessionInUrl: true
});

async function updateShop() {
	const { data } = await Supabase.from("config").select("*").eq("id", "all");
	const ShopItems = await data[0].MarketItems;
	const newItems = [];

	for (var index in ShopItems) {
		const Item = ShopItems[index];

		Item.onsale = false;

		if (Item.autoSale && Item.autoSale === true) RawItems.push(index);
	}

	function getItem() {
		const RNG = RawItems[Math.floor(Math.random() * RawItems.length)];
		SellableItems.splice(0, 0, RNG);
		SellableItems.push(RNG);
		return RNG;
	}

	for (var i = 0; i <= avaliableItems; i++) {
		let Item = getItem();

		if (newItems.includes(Item)) {
			i--;
		} else {
			newItems.push(Item);
		}
	}

	(async () => {
		const { error } = await Supabase.from("config").update({
			"market": {
				"updates": Math.ceil((Date.now() + 86400000) / 1000),
				"items": newItems
			}
		}).eq("id", "all");

		if (error) console.log(error);

		console.log("Market Refreshed");
	})();
}

updateShop();

setInterval(updateShop, 86400000);