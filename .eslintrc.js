module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
        // disable
    	"no-bitwise": 0,
        // alter
    	"no-plusplus": ["error", {
    		"allowForLoopAfterthoughts": true
    	}],
        // add
        "no-var": "error"
    }
};
