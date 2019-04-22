const csv = require("../node_modules/fast-csv");
const fs = require("fs");
const os = require("os");

if (os.type() == "Windows_NT") {
    var outputPath = ".\\output\\";
    var baseLineDataPath = ".\\baseline\\";
    var readJSONPath = ".\\config.json";
} else {
    var outputPath = "./output/";
    var baseLineDataPath = "./baseline/";
    var readJSONPath = "./config.json";
}

var csvFilePath = outputPath + "unitTestsBaseline.csv";
var writeJSONPath = outputPath + "baseline.config.json";

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

var csvCount = 0;
var baseLineData = new Map();
var baseLineJSON = new Map();

var csvStream = csv.createWriteStream({headers: true}).transform(function(row) {return {
    "Feature": row.Feature,
    "Case Id": row.CaseId,
    "Test Case": row.TestCase,
    "macOS-Polyfill-Fast-WASM": row.MPFWASM,
    "macOS-Polyfill-Sustained-WebGL": row.MPSWEBGL,
    "macOS-WebNN-Fast-BNNS": row.MWFBNNS,
    "macOS-WebNN-Fast-MKLDNN": row.MWFMKLDNN,
    "macOS-WebNN-Sustained-MPS": row.MWSMPS,
    "Android-Polyfill-Fast-WASM": row.APFWASM,
    "Android-Polyfill-Sustained-WebGL": row.APSWEBGL,
//    "Android-WebNN-Fast-NNAPI": row.AWFNNAPI,
    "Android-WebNN-Sustained-NNAPI": row.AWSNNAPI,
//    "Android-WebNN-Low-NNAPI": row.AWLNNAPI,
    "Win-Polyfill-Fast-WASM": row.WPFWASM,
    "Win-Polyfill-Sustained-WebGL": row.WPSWEBGL,
    "Win-WebNN-Fast-MKLDNN": row.WWFMKLDNN,
    "Win-WebNN-Sustained-DML": row.WWSDML,
    "Win-WebNN-Sustained-clDNN": row.WWSCLDNN,
    "Win-WebNN-Low-DML": row.WWLDML,
    "Linux-Polyfill-Fast-WASM": row.LPFWASM,
    "Linux-Polyfill-Sustained-WebGL": row.LPSWEBGL,
    "Linux-WebNN-Fast-MKLDNN": row.LWFMKLDNN,
    "Linux-WebNN-Sustained-clDNN": row.LWSCLDNN,
    "Linux-WebNN-Fast-IE-MKLDNN": row.LWFIEMKLDNN,
    "Linux-WebNN-Sustained-IE-clDNN": row.LWSIECLDNN,
    "Linux-WebNN-Low-IE-MYRIAD": row.LWLIEMYRIAD
}});

csvStream.pipe(fs.createWriteStream(csvFilePath));

var readJSON = JSON.parse(fs.readFileSync(readJSONPath));
baseLineJSON["Version"] = new Map();
baseLineJSON["Version"]["chromium"] = readJSON.Version.chromium;
baseLineJSON["Version"]["polyfill"] = readJSON.Version.polyfill;

fs.readdir(baseLineDataPath, function(err, files) {
    if (err) {
        throw err;
    } else {
        files.forEach(function(filename) {
            let filenameArray = filename.split("-");
            let backend = null;
            let csvRow = null;

            // classifier
            switch(filenameArray[1]) {
                case "macOS":
                switch(filenameArray[2]) {
                    case "Polyfill":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "WASM":
                            backend = "macOS-Polyfill-Fast-WASM";
                            csvRow = "MPFWASM";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "WebGL":
                            backend = "macOS-Polyfill-Sustained-WebGL";
                            csvRow = "MPSWEBGL";
                            break;
                        }
                        break;
                    }
                    break;

                    case "WebNN":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "BNNS":
                            backend = "macOS-WebNN-Fast-BNNS";
                            csvRow = "MWFBNNS";
                            break;

                            case "MKLDNN":
                            backend = "macOS-WebNN-Fast-MKLDNN";
                            csvRow = "MWFMKLDNN";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "MPS":
                            backend = "macOS-WebNN-Sustained-MPS";
                            csvRow = "MWSMPS";
                            break;
                        }
                        break;
                    }
                    break;
                };
                break;

                case "Android":
                switch(filenameArray[2]) {
                    case "Polyfill":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "WASM":
                            backend = "Android-Polyfill-Fast-WASM";
                            csvRow = "APFWASM";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "WebGL":
                            backend = "Android-Polyfill-Sustained-WebGL";
                            csvRow = "APSWEBGL";
                            break;
                        }
                        break;
                    }
                    break;

                    case "WebNN":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "NNAPI":
                            backend = "Android-WebNN-Fast-NNAPI";
                            csvRow = "AWFNNAPI";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "NNAPI":
                            backend = "Android-WebNN-Sustained-NNAPI";
                            csvRow = "AWSNNAPI";
                            break;
                        }
                        break;

                        case "Low":
                        switch(filenameArray[4]) {
                            case "NNAPI":
                            backend = "Android-WebNN-Low-NNAPI";
                            csvRow = "AWLNNAPI";
                            break;
                        }
                        break;
                    }
                    break;
                };
                break;

                case "Win":
                switch(filenameArray[2]) {
                    case "Polyfill":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "WASM":
                            backend = "Win-Polyfill-Fast-WASM";
                            csvRow = "WPFWASM";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "WebGL":
                            backend = "Win-Polyfill-Sustained-WebGL";
                            csvRow = "WPSWEBGL";
                            break;
                        }
                        break;
                    }
                    break;

                    case "WebNN":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "MKLDNN":
                            backend = "Win-WebNN-Fast-MKLDNN";
                            csvRow = "WWFMKLDNN";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "DML":
                            backend = "Win-WebNN-Sustained-DML";
                            csvRow = "WWSDML";
                            break;

                            case "clDNN":
                            backend = "Win-WebNN-Sustained-clDNN";
                            csvRow = "WWSCLDNN";
                            break;
                        }
                        break;

                        case "Low":
                        switch(filenameArray[4]) {
                            case "DML":
                            backend = "Win-WebNN-Low-DML";
                            csvRow = "WWLDML";
                            break;
                        }
                        break;
                    }
                    break;
                };
                break;

                case "Linux":
                switch(filenameArray[2]) {
                    case "Polyfill":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "WASM":
                            backend = "Linux-Polyfill-Fast-WASM";
                            csvRow = "LPFWASM";
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "WebGL":
                            backend = "Linux-Polyfill-Sustained-WebGL";
                            csvRow = "LPSWEBGL";
                            break;
                        }
                        break;
                    }
                    break;

                    case "WebNN":
                    switch(filenameArray[3]) {
                        case "Fast":
                        switch(filenameArray[4]) {
                            case "MKLDNN":
                            backend = "Linux-WebNN-Fast-MKLDNN";
                            csvRow = "LWFMKLDNN";
                            break;

                            case "IE":
                            switch(filenameArray[5]) {
                                case "MKLDNN":
                                backend = "Linux-WebNN-Fast-IE-MKLDNN";
                                csvRow = "LWFIEMKLDNN";
                                break;
                            }
                            break;
                        }
                        break;

                        case "Sustained":
                        switch(filenameArray[4]) {
                            case "clDNN":
                            backend = "Linux-WebNN-Sustained-clDNN";
                            csvRow = "LWSCLDNN";
                            break;

                            case "IE":
                            switch(filenameArray[5]) {
                                case "clDNN":
                                backend = "Linux-WebNN-Sustained-IE-clDNN";
                                csvRow = "LWSIECLDNN";
                                break;
                            }
                            break;
                        }
                        break;

                        case "Low":
                        switch(filenameArray[4]) {
                            case "IE":
                            switch(filenameArray[5]) {
                                case "MYRIAD":
                                backend = "Linux-WebNN-Low-IE-MYRIAD";
                                csvRow = "LWLIEMYRIAD";
                                break;
                            }
                            break;
                        }
                        break;
                    }
                    break;
                };
                break;
            }

            baseLineJSON[backend] = new Map();
            baseLineJSON[backend]["total"] = 0;
            baseLineJSON[backend]["pass"] = 0;
            baseLineJSON[backend]["fail"] = 0;
            baseLineJSON[backend]["block"] = 0;

            csv.fromPath(baseLineDataPath + filename).on("data", function(data){
                if (data[0] !== "Feature") {
                    if (typeof baseLineData.get(data[0] + "-" + data[1]) == "undefined") {
                        baseLineData.set(data[0] + "-" + data[1], new Array());
                        baseLineData.get(data[0] + "-" + data[1])["Feature"] = data[0];
                        baseLineData.get(data[0] + "-" + data[1])["CaseId"] = data[1];
                        baseLineData.get(data[0] + "-" + data[1])["TestCase"] = data[2];
                    }

                    if (data[3] == "1") {
                        baseLineData.get(data[0] + "-" + data[1])[csvRow] = "Pass";
                        baseLineJSON[backend]["pass"] = baseLineJSON[backend]["pass"] + 1;
                    } else if (data[4] == "1") {
                        baseLineData.get(data[0] + "-" + data[1])[csvRow] = "Fail";
                        baseLineJSON[backend]["fail"] = baseLineJSON[backend]["fail"] + 1;
                    } else if (data[5] == "1") {
                        baseLineData.get(data[0] + "-" + data[1])[csvRow] = "N/A";
                        baseLineJSON[backend]["block"] = baseLineJSON[backend]["block"] + 1;
                    }

                    baseLineJSON[backend]["total"] = baseLineJSON[backend]["total"] + 1;
                }
            }).on("end", function() {
                csvCount = csvCount + 1;

                // Write all-csv file When the last csv file has read
                if (csvCount == files.length) {
                    for (let value of baseLineData.values()) {
                        csvStream.write(value);
                    }

                    fs.writeFileSync(writeJSONPath, JSON.stringify(baseLineJSON, null, 4));
                }
            });
        });
    }
});
