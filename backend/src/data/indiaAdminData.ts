/**
 * Indian Administrative Geographic Hierarchy & Monitoring Station Registry
 * Hierarchy: INDIA -> STATE -> DISTRICT -> CITY/TOWN -> MONITORING STATION
 * Boundary Source: DataMeet Survey of India Administrative Boundary Dataset (ODbL / CC BY 4.0)
 */

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  centroid: [number, number]; // [lat, lon]
  bbox: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
}

export interface MonitoringStationInfo {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  stationType?: string;
}

export const INDIA_STATES: string[] = [
  "Andaman and Nicobar",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const INDIA_DISTRICTS_BY_STATE: Record<string, DistrictInfo[]> = {
  "Andaman and Nicobar": [
    {
      "id": "andaman_and_nicobar_andaman_islands",
      "name": "Andaman Islands",
      "state": "Andaman and Nicobar",
      "centroid": [
        12.7233,
        93.2425
      ],
      "bbox": [
        10.5109,
        92.2072,
        14.9358,
        94.2778
      ]
    },
    {
      "id": "andaman_and_nicobar_nicobar_islands",
      "name": "Nicobar Islands",
      "state": "Andaman and Nicobar",
      "centroid": [
        8.0056,
        93.333
      ],
      "bbox": [
        6.7543,
        92.7181,
        9.2569,
        93.9478
      ]
    }
  ],
  "Telangana": [
    {
      "id": "telangana_adilabad",
      "name": "Adilabad",
      "state": "Telangana",
      "centroid": [
        19.2982,
        78.8653
      ],
      "bbox": [
        18.6803,
        77.7574,
        19.9161,
        79.9731
      ]
    },
    {
      "id": "telangana_hyderabad",
      "name": "Hyderabad",
      "state": "Telangana",
      "centroid": [
        17.3845,
        78.4593
      ],
      "bbox": [
        17.2971,
        78.3841,
        17.4718,
        78.5345
      ]
    },
    {
      "id": "telangana_karimnagar",
      "name": "Karimnagar",
      "state": "Telangana",
      "centroid": [
        18.5231,
        79.427
      ],
      "bbox": [
        17.975,
        78.5172,
        19.0711,
        80.3367
      ]
    },
    {
      "id": "telangana_khammam",
      "name": "Khammam",
      "state": "Telangana",
      "centroid": [
        17.6955,
        80.7897
      ],
      "bbox": [
        16.7628,
        79.7851,
        18.6281,
        81.7944
      ]
    },
    {
      "id": "telangana_mahbubnagar",
      "name": "Mahbubnagar",
      "state": "Telangana",
      "centroid": [
        16.5302,
        78.2325
      ],
      "bbox": [
        15.8272,
        77.2352,
        17.2332,
        79.2298
      ]
    },
    {
      "id": "telangana_medak",
      "name": "Medak",
      "state": "Telangana",
      "centroid": [
        17.8494,
        78.2845
      ],
      "bbox": [
        17.4151,
        77.4399,
        18.2838,
        79.1292
      ]
    },
    {
      "id": "telangana_nalgonda",
      "name": "Nalgonda",
      "state": "Telangana",
      "centroid": [
        17.0839,
        79.3385
      ],
      "bbox": [
        16.3628,
        78.6074,
        17.805,
        80.0697
      ]
    },
    {
      "id": "telangana_nizamabad",
      "name": "Nizamabad",
      "state": "Telangana",
      "centroid": [
        18.5382,
        78.0966
      ],
      "bbox": [
        18.0737,
        77.5195,
        19.0026,
        78.6737
      ]
    },
    {
      "id": "telangana_rangareddy",
      "name": "Rangareddy",
      "state": "Telangana",
      "centroid": [
        17.2759,
        78.1045
      ],
      "bbox": [
        16.8432,
        77.36,
        17.7086,
        78.849
      ]
    },
    {
      "id": "telangana_warangal",
      "name": "Warangal",
      "state": "Telangana",
      "centroid": [
        17.9591,
        79.7404
      ],
      "bbox": [
        17.3135,
        78.8223,
        18.6047,
        80.6585
      ]
    }
  ],
  "Andhra Pradesh": [
    {
      "id": "andhra_pradesh_anantapur",
      "name": "Anantapur",
      "state": "Andhra Pradesh",
      "centroid": [
        14.4507,
        77.6093
      ],
      "bbox": [
        13.6758,
        76.757,
        15.2256,
        78.4616
      ]
    },
    {
      "id": "andhra_pradesh_chittoor",
      "name": "Chittoor",
      "state": "Andhra Pradesh",
      "centroid": [
        13.2983,
        79.049
      ],
      "bbox": [
        12.6118,
        78.0583,
        13.9848,
        80.0398
      ]
    },
    {
      "id": "andhra_pradesh_cuddapah",
      "name": "Cuddapah",
      "state": "Andhra Pradesh",
      "centroid": [
        14.4705,
        78.7004
      ],
      "bbox": [
        13.7122,
        77.9398,
        15.2289,
        79.4609
      ]
    },
    {
      "id": "andhra_pradesh_east_godavari",
      "name": "East Godavari",
      "state": "Andhra Pradesh",
      "centroid": [
        17.1579,
        82.0466
      ],
      "bbox": [
        16.3101,
        81.498,
        18.0057,
        82.5953
      ]
    },
    {
      "id": "andhra_pradesh_guntur",
      "name": "Guntur",
      "state": "Andhra Pradesh",
      "centroid": [
        16.2791,
        80.0442
      ],
      "bbox": [
        15.7318,
        79.192,
        16.8264,
        80.8963
      ]
    },
    {
      "id": "andhra_pradesh_krishna",
      "name": "Krishna",
      "state": "Andhra Pradesh",
      "centroid": [
        16.4235,
        80.7812
      ],
      "bbox": [
        15.709,
        79.9917,
        17.138,
        81.5707
      ]
    },
    {
      "id": "andhra_pradesh_kurnool",
      "name": "Kurnool",
      "state": "Andhra Pradesh",
      "centroid": [
        15.526,
        77.9478
      ],
      "bbox": [
        14.8924,
        76.9701,
        16.1595,
        78.9255
      ]
    },
    {
      "id": "andhra_pradesh_nellore",
      "name": "Nellore",
      "state": "Andhra Pradesh",
      "centroid": [
        14.2386,
        79.6895
      ],
      "bbox": [
        13.3694,
        79.0625,
        15.1079,
        80.3165
      ]
    },
    {
      "id": "andhra_pradesh_prakasam",
      "name": "Prakasam",
      "state": "Andhra Pradesh",
      "centroid": [
        15.6271,
        79.6033
      ],
      "bbox": [
        14.9435,
        78.7347,
        16.3106,
        80.4718
      ]
    },
    {
      "id": "andhra_pradesh_srikakulam",
      "name": "Srikakulam",
      "state": "Andhra Pradesh",
      "centroid": [
        18.6162,
        84.0836
      ],
      "bbox": [
        18.0755,
        83.4061,
        19.1569,
        84.761
      ]
    },
    {
      "id": "andhra_pradesh_vishakhapatnam",
      "name": "Vishakhapatnam",
      "state": "Andhra Pradesh",
      "centroid": [
        17.8924,
        82.6678
      ],
      "bbox": [
        17.2463,
        81.8582,
        18.5385,
        83.4774
      ]
    },
    {
      "id": "andhra_pradesh_vizianagaram",
      "name": "Vizianagaram",
      "state": "Andhra Pradesh",
      "centroid": [
        18.4868,
        83.4038
      ],
      "bbox": [
        17.82,
        82.9915,
        19.1536,
        83.8161
      ]
    },
    {
      "id": "andhra_pradesh_west_godavari",
      "name": "West Godavari",
      "state": "Andhra Pradesh",
      "centroid": [
        16.9049,
        81.3565
      ],
      "bbox": [
        16.3199,
        80.855,
        17.49,
        81.858
      ]
    }
  ],
  "Arunachal Pradesh": [
    {
      "id": "arunachal_pradesh_changlang",
      "name": "Changlang",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.288,
        96.4046
      ],
      "bbox": [
        26.9079,
        95.637,
        27.6682,
        97.1722
      ]
    },
    {
      "id": "arunachal_pradesh_east_kameng",
      "name": "East Kameng",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.3287,
        92.9904
      ],
      "bbox": [
        26.9155,
        92.5902,
        27.7419,
        93.3907
      ]
    },
    {
      "id": "arunachal_pradesh_east_siang",
      "name": "East Siang",
      "state": "Arunachal Pradesh",
      "centroid": [
        28.1513,
        95.1564
      ],
      "bbox": [
        27.7395,
        94.7414,
        28.5631,
        95.5713
      ]
    },
    {
      "id": "arunachal_pradesh_kurung_kumey",
      "name": "Kurung Kumey",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.9815,
        93.2859
      ],
      "bbox": [
        27.5954,
        92.6612,
        28.3676,
        93.9106
      ]
    },
    {
      "id": "arunachal_pradesh_lohit",
      "name": "Lohit",
      "state": "Arunachal Pradesh",
      "centroid": [
        28.0087,
        96.5867
      ],
      "bbox": [
        27.5511,
        95.7582,
        28.4664,
        97.4152
      ]
    },
    {
      "id": "arunachal_pradesh_lower_dibang_valley",
      "name": "Lower Dibang Valley",
      "state": "Arunachal Pradesh",
      "centroid": [
        28.3132,
        95.8467
      ],
      "bbox": [
        27.8818,
        95.3204,
        28.7445,
        96.373
      ]
    },
    {
      "id": "arunachal_pradesh_lower_subansiri",
      "name": "Lower Subansiri",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.6793,
        93.8743
      ],
      "bbox": [
        27.3297,
        93.3917,
        28.0289,
        94.3568
      ]
    },
    {
      "id": "arunachal_pradesh_papum_pare",
      "name": "Papum Pare",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.2902,
        93.7109
      ],
      "bbox": [
        26.9385,
        93.2112,
        27.6419,
        94.2107
      ]
    },
    {
      "id": "arunachal_pradesh_tawang",
      "name": "Tawang",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.6621,
        91.9299
      ],
      "bbox": [
        27.4606,
        91.5439,
        27.8635,
        92.316
      ]
    },
    {
      "id": "arunachal_pradesh_tirap",
      "name": "Tirap",
      "state": "Arunachal Pradesh",
      "centroid": [
        26.9633,
        95.4698
      ],
      "bbox": [
        26.656,
        95.1845,
        27.2706,
        95.755
      ]
    },
    {
      "id": "arunachal_pradesh_upper_dibang_valley",
      "name": "Upper Dibang Valley",
      "state": "Arunachal Pradesh",
      "centroid": [
        29.0129,
        95.9292
      ],
      "bbox": [
        28.5624,
        95.2424,
        29.4633,
        96.616
      ]
    },
    {
      "id": "arunachal_pradesh_upper_siang",
      "name": "Upper Siang",
      "state": "Arunachal Pradesh",
      "centroid": [
        28.7486,
        94.7908
      ],
      "bbox": [
        28.1486,
        94.1719,
        29.3486,
        95.4097
      ]
    },
    {
      "id": "arunachal_pradesh_upper_subansiri",
      "name": "Upper Subansiri",
      "state": "Arunachal Pradesh",
      "centroid": [
        28.2368,
        93.8884
      ],
      "bbox": [
        27.7605,
        93.1811,
        28.7131,
        94.5956
      ]
    },
    {
      "id": "arunachal_pradesh_west_kameng",
      "name": "West Kameng",
      "state": "Arunachal Pradesh",
      "centroid": [
        27.4338,
        92.6238
      ],
      "bbox": [
        26.8898,
        92.0112,
        27.9779,
        93.2363
      ]
    },
    {
      "id": "arunachal_pradesh_west_siang",
      "name": "West Siang",
      "state": "Arunachal Pradesh",
      "centroid": [
        28.2824,
        94.4591
      ],
      "bbox": [
        27.5577,
        93.9603,
        29.007,
        94.9579
      ]
    }
  ],
  "Assam": [
    {
      "id": "assam_barpeta",
      "name": "Barpeta",
      "state": "Assam",
      "centroid": [
        26.4547,
        90.9758
      ],
      "bbox": [
        26.0895,
        90.6517,
        26.8198,
        91.2998
      ]
    },
    {
      "id": "assam_bongaigaon",
      "name": "Bongaigaon",
      "state": "Assam",
      "centroid": [
        26.4695,
        90.6504
      ],
      "bbox": [
        26.1438,
        90.346,
        26.7951,
        90.9548
      ]
    },
    {
      "id": "assam_cachar",
      "name": "Cachar",
      "state": "Assam",
      "centroid": [
        24.761,
        92.8434
      ],
      "bbox": [
        24.3764,
        92.4236,
        25.1455,
        93.2633
      ]
    },
    {
      "id": "assam_darrang",
      "name": "Darrang",
      "state": "Assam",
      "centroid": [
        26.5673,
        92.0438
      ],
      "bbox": [
        26.1989,
        91.7042,
        26.9356,
        92.3833
      ]
    },
    {
      "id": "assam_dhemaji",
      "name": "Dhemaji",
      "state": "Assam",
      "centroid": [
        27.584,
        94.8653
      ],
      "bbox": [
        27.2861,
        94.2111,
        27.8818,
        95.5194
      ]
    },
    {
      "id": "assam_dhuburi",
      "name": "Dhuburi",
      "state": "Assam",
      "centroid": [
        25.9433,
        90.0873
      ],
      "bbox": [
        25.4729,
        89.6948,
        26.4138,
        90.4798
      ]
    },
    {
      "id": "assam_dibrugarh",
      "name": "Dibrugarh",
      "state": "Assam",
      "centroid": [
        27.4057,
        95.0301
      ],
      "bbox": [
        27.0987,
        94.5693,
        27.7126,
        95.491
      ]
    },
    {
      "id": "assam_goalpara",
      "name": "Goalpara",
      "state": "Assam",
      "centroid": [
        26.0562,
        90.6079
      ],
      "bbox": [
        25.8843,
        90.1183,
        26.228,
        91.0975
      ]
    },
    {
      "id": "assam_golaghat",
      "name": "Golaghat",
      "state": "Assam",
      "centroid": [
        26.3736,
        93.7334
      ],
      "bbox": [
        25.8144,
        93.2867,
        26.9329,
        94.18
      ]
    },
    {
      "id": "assam_hailakandi",
      "name": "Hailakandi",
      "state": "Assam",
      "centroid": [
        24.5075,
        92.5996
      ],
      "bbox": [
        24.1348,
        92.4182,
        24.8803,
        92.7811
      ]
    },
    {
      "id": "assam_jorhat",
      "name": "Jorhat",
      "state": "Assam",
      "centroid": [
        26.7694,
        94.2816
      ],
      "bbox": [
        26.3533,
        93.9585,
        27.1856,
        94.6047
      ]
    },
    {
      "id": "assam_kamrup",
      "name": "Kamrup",
      "state": "Assam",
      "centroid": [
        26.2605,
        91.557
      ],
      "bbox": [
        25.7234,
        90.9356,
        26.7976,
        92.1783
      ]
    },
    {
      "id": "assam_karbi_anglong",
      "name": "Karbi Anglong",
      "state": "Assam",
      "centroid": [
        26.0735,
        93.0233
      ],
      "bbox": [
        25.532,
        92.1496,
        26.6149,
        93.8971
      ]
    },
    {
      "id": "assam_karimganj",
      "name": "Karimganj",
      "state": "Assam",
      "centroid": [
        24.5847,
        92.4009
      ],
      "bbox": [
        24.2493,
        92.2129,
        24.92,
        92.589
      ]
    },
    {
      "id": "assam_kokrajhar",
      "name": "Kokrajhar",
      "state": "Assam",
      "centroid": [
        26.5994,
        90.1885
      ],
      "bbox": [
        26.2969,
        89.762,
        26.9019,
        90.615
      ]
    },
    {
      "id": "assam_lakhimpur",
      "name": "Lakhimpur",
      "state": "Assam",
      "centroid": [
        27.1749,
        94.1482
      ],
      "bbox": [
        26.8263,
        93.6983,
        27.5235,
        94.5981
      ]
    },
    {
      "id": "assam_marigaon",
      "name": "Marigaon",
      "state": "Assam",
      "centroid": [
        26.2906,
        92.2604
      ],
      "bbox": [
        26.0625,
        91.9534,
        26.5187,
        92.5674
      ]
    },
    {
      "id": "assam_nagaon",
      "name": "Nagaon",
      "state": "Assam",
      "centroid": [
        26.2086,
        92.8624
      ],
      "bbox": [
        25.716,
        92.4041,
        26.7011,
        93.3207
      ]
    },
    {
      "id": "assam_nalbari",
      "name": "Nalbari",
      "state": "Assam",
      "centroid": [
        26.4864,
        91.4609
      ],
      "bbox": [
        26.1371,
        91.2146,
        26.8356,
        91.7072
      ]
    },
    {
      "id": "assam_north_cachar_hills",
      "name": "North Cachar Hills",
      "state": "Assam",
      "centroid": [
        25.3985,
        93.0015
      ],
      "bbox": [
        24.9709,
        92.5247,
        25.8261,
        93.4782
      ]
    },
    {
      "id": "assam_sibsagar",
      "name": "Sibsagar",
      "state": "Assam",
      "centroid": [
        26.9988,
        94.8872
      ],
      "bbox": [
        26.7186,
        94.4008,
        27.2791,
        95.3735
      ]
    },
    {
      "id": "assam_sonitpur",
      "name": "Sonitpur",
      "state": "Assam",
      "centroid": [
        26.7678,
        93.0556
      ],
      "bbox": [
        26.4972,
        92.3224,
        27.0385,
        93.7889
      ]
    },
    {
      "id": "assam_tinsukia",
      "name": "Tinsukia",
      "state": "Assam",
      "centroid": [
        27.6035,
        95.6208
      ],
      "bbox": [
        27.2295,
        95.2207,
        27.9774,
        96.0209
      ]
    }
  ],
  "Bihar": [
    {
      "id": "bihar_araria",
      "name": "Araria",
      "state": "Bihar",
      "centroid": [
        26.2647,
        87.3612
      ],
      "bbox": [
        25.9424,
        87.0315,
        26.587,
        87.6909
      ]
    },
    {
      "id": "bihar_aurangabad",
      "name": "Aurangabad",
      "state": "Bihar",
      "centroid": [
        24.8055,
        84.3695
      ],
      "bbox": [
        24.4814,
        83.9922,
        25.1296,
        84.7467
      ]
    },
    {
      "id": "bihar_banka",
      "name": "Banka",
      "state": "Bihar",
      "centroid": [
        24.8303,
        86.8274
      ],
      "bbox": [
        24.5387,
        86.481,
        25.122,
        87.1738
      ]
    },
    {
      "id": "bihar_begusarai",
      "name": "Begusarai",
      "state": "Bihar",
      "centroid": [
        25.5134,
        86.1186
      ],
      "bbox": [
        25.2499,
        85.7284,
        25.7768,
        86.5088
      ]
    },
    {
      "id": "bihar_bhabua",
      "name": "Bhabua",
      "state": "Bihar",
      "centroid": [
        24.9761,
        83.6042
      ],
      "bbox": [
        24.5417,
        83.3161,
        25.4106,
        83.8922
      ]
    },
    {
      "id": "bihar_bhagalpur",
      "name": "Bhagalpur",
      "state": "Bihar",
      "centroid": [
        25.2861,
        87.09
      ],
      "bbox": [
        25.058,
        86.6326,
        25.5143,
        87.5474
      ]
    },
    {
      "id": "bihar_bhojpur",
      "name": "Bhojpur",
      "state": "Bihar",
      "centroid": [
        25.4507,
        84.5565
      ],
      "bbox": [
        25.1624,
        84.2673,
        25.7391,
        84.8456
      ]
    },
    {
      "id": "bihar_buxar",
      "name": "Buxar",
      "state": "Bihar",
      "centroid": [
        25.5061,
        84.0752
      ],
      "bbox": [
        25.2634,
        83.7619,
        25.7487,
        84.3885
      ]
    },
    {
      "id": "bihar_darbhanga",
      "name": "Darbhanga",
      "state": "Bihar",
      "centroid": [
        26.1583,
        86.0322
      ],
      "bbox": [
        25.8673,
        85.6648,
        26.4493,
        86.3996
      ]
    },
    {
      "id": "bihar_gaya",
      "name": "Gaya",
      "state": "Bihar",
      "centroid": [
        24.6805,
        84.8379
      ],
      "bbox": [
        24.287,
        84.2853,
        25.074,
        85.3905
      ]
    },
    {
      "id": "bihar_gopalganj",
      "name": "Gopalganj",
      "state": "Bihar",
      "centroid": [
        26.4248,
        84.4014
      ],
      "bbox": [
        26.2068,
        83.9008,
        26.6429,
        84.9019
      ]
    },
    {
      "id": "bihar_jamui",
      "name": "Jamui",
      "state": "Bihar",
      "centroid": [
        24.7563,
        86.2159
      ],
      "bbox": [
        24.3684,
        85.8202,
        25.1442,
        86.6116
      ]
    },
    {
      "id": "bihar_jehanabad",
      "name": "Jehanabad",
      "state": "Bihar",
      "centroid": [
        25.1514,
        84.8261
      ],
      "bbox": [
        24.9813,
        84.4402,
        25.3215,
        85.212
      ]
    },
    {
      "id": "bihar_katihar",
      "name": "Katihar",
      "state": "Bihar",
      "centroid": [
        25.5404,
        87.6359
      ],
      "bbox": [
        25.1993,
        87.1988,
        25.8815,
        88.0729
      ]
    },
    {
      "id": "bihar_khagaria",
      "name": "Khagaria",
      "state": "Bihar",
      "centroid": [
        25.4915,
        86.5636
      ],
      "bbox": [
        25.2538,
        86.2737,
        25.7293,
        86.8535
      ]
    },
    {
      "id": "bihar_kishanganj",
      "name": "Kishanganj",
      "state": "Bihar",
      "centroid": [
        26.2444,
        87.9453
      ],
      "bbox": [
        25.9314,
        87.5987,
        26.5573,
        88.2919
      ]
    },
    {
      "id": "bihar_lakhisarai",
      "name": "Lakhisarai",
      "state": "Bihar",
      "centroid": [
        25.1581,
        86.1529
      ],
      "bbox": [
        24.9755,
        85.8807,
        25.3408,
        86.4251
      ]
    },
    {
      "id": "bihar_madhepura",
      "name": "Madhepura",
      "state": "Bihar",
      "centroid": [
        25.7821,
        86.8554
      ],
      "bbox": [
        25.4438,
        86.6015,
        26.1204,
        87.1093
      ]
    },
    {
      "id": "bihar_madhubani",
      "name": "Madhubani",
      "state": "Bihar",
      "centroid": [
        26.3556,
        86.2308
      ],
      "bbox": [
        26.0448,
        85.7443,
        26.6664,
        86.7172
      ]
    },
    {
      "id": "bihar_munger",
      "name": "Munger",
      "state": "Bihar",
      "centroid": [
        25.2225,
        86.514
      ],
      "bbox": [
        24.9453,
        86.299,
        25.4997,
        86.729
      ]
    },
    {
      "id": "bihar_muzaffarpur",
      "name": "Muzaffarpur",
      "state": "Bihar",
      "centroid": [
        26.1486,
        85.3072
      ],
      "bbox": [
        25.9022,
        84.8681,
        26.395,
        85.7463
      ]
    },
    {
      "id": "bihar_nalanda",
      "name": "Nalanda",
      "state": "Bihar",
      "centroid": [
        25.214,
        85.538
      ],
      "bbox": [
        24.9663,
        85.1576,
        25.4617,
        85.9184
      ]
    },
    {
      "id": "bihar_nawada",
      "name": "Nawada",
      "state": "Bihar",
      "centroid": [
        24.8188,
        85.6568
      ],
      "bbox": [
        24.5245,
        85.263,
        25.1132,
        86.0506
      ]
    },
    {
      "id": "bihar_pashchim_champaran",
      "name": "Pashchim Champaran",
      "state": "Bihar",
      "centroid": [
        27.0534,
        84.2914
      ],
      "bbox": [
        26.5853,
        83.8283,
        27.5215,
        84.7545
      ]
    },
    {
      "id": "bihar_patna",
      "name": "Patna",
      "state": "Bihar",
      "centroid": [
        25.4676,
        85.3693
      ],
      "bbox": [
        25.2024,
        84.6784,
        25.7328,
        86.0602
      ]
    },
    {
      "id": "bihar_purba_champaran",
      "name": "Purba Champaran",
      "state": "Bihar",
      "centroid": [
        26.6389,
        84.8837
      ],
      "bbox": [
        26.2568,
        84.4781,
        27.021,
        85.2894
      ]
    },
    {
      "id": "bihar_purnia",
      "name": "Purnia",
      "state": "Bihar",
      "centroid": [
        25.7794,
        87.4221
      ],
      "bbox": [
        25.4332,
        86.9839,
        26.1256,
        87.8603
      ]
    },
    {
      "id": "bihar_rohtas",
      "name": "Rohtas",
      "state": "Bihar",
      "centroid": [
        24.9402,
        83.9755
      ],
      "bbox": [
        24.5049,
        83.4932,
        25.3756,
        84.4578
      ]
    },
    {
      "id": "bihar_saharsa",
      "name": "Saharsa",
      "state": "Bihar",
      "centroid": [
        25.8376,
        86.5867
      ],
      "bbox": [
        25.596,
        86.3037,
        26.0791,
        86.8698
      ]
    },
    {
      "id": "bihar_samastipur",
      "name": "Samastipur",
      "state": "Bihar",
      "centroid": [
        25.7777,
        85.9675
      ],
      "bbox": [
        25.464,
        85.5252,
        26.0913,
        86.4099
      ]
    },
    {
      "id": "bihar_saran",
      "name": "Saran",
      "state": "Bihar",
      "centroid": [
        25.9239,
        84.7984
      ],
      "bbox": [
        25.625,
        84.4024,
        26.2227,
        85.1944
      ]
    },
    {
      "id": "bihar_sheikhpura",
      "name": "Sheikhpura",
      "state": "Bihar",
      "centroid": [
        25.1255,
        85.7777
      ],
      "bbox": [
        24.9731,
        85.5969,
        25.2778,
        85.9585
      ]
    },
    {
      "id": "bihar_sheohar",
      "name": "Sheohar",
      "state": "Bihar",
      "centroid": [
        26.4868,
        85.3207
      ],
      "bbox": [
        26.3267,
        85.1728,
        26.6469,
        85.4685
      ]
    },
    {
      "id": "bihar_sitamarhi",
      "name": "Sitamarhi",
      "state": "Bihar",
      "centroid": [
        27.0613,
        86.2687
      ],
      "bbox": [
        26.2719,
        85.2307,
        27.8507,
        87.3068
      ]
    },
    {
      "id": "bihar_siwan",
      "name": "Siwan",
      "state": "Bihar",
      "centroid": [
        26.1331,
        84.3881
      ],
      "bbox": [
        25.8897,
        84.0021,
        26.3764,
        84.7741
      ]
    },
    {
      "id": "bihar_supaul",
      "name": "Supaul",
      "state": "Bihar",
      "centroid": [
        26.2777,
        86.7472
      ],
      "bbox": [
        25.9989,
        86.3896,
        26.5566,
        87.1048
      ]
    },
    {
      "id": "bihar_vaishali",
      "name": "Vaishali",
      "state": "Bihar",
      "centroid": [
        25.7509,
        85.3458
      ],
      "bbox": [
        25.4853,
        85.0613,
        26.0165,
        85.6304
      ]
    }
  ],
  "Chandigarh": [
    {
      "id": "chandigarh_chandigarh",
      "name": "Chandigarh",
      "state": "Chandigarh",
      "centroid": [
        30.7341,
        76.7635
      ],
      "bbox": [
        30.6693,
        76.6906,
        30.799,
        76.8363
      ]
    }
  ],
  "Chhattisgarh": [
    {
      "id": "chhattisgarh_bastar",
      "name": "Bastar",
      "state": "Chhattisgarh",
      "centroid": [
        19.3931,
        81.4477
      ],
      "bbox": [
        18.5951,
        80.6559,
        20.1911,
        82.2396
      ]
    },
    {
      "id": "chhattisgarh_bilaspur",
      "name": "Bilaspur",
      "state": "Chhattisgarh",
      "centroid": [
        22.413,
        82.2459
      ],
      "bbox": [
        21.7092,
        81.4766,
        23.1168,
        83.0151
      ]
    },
    {
      "id": "chhattisgarh_dantewada",
      "name": "Dantewada",
      "state": "Chhattisgarh",
      "centroid": [
        18.5919,
        81.097
      ],
      "bbox": [
        17.7828,
        80.2396,
        19.4009,
        81.9545
      ]
    },
    {
      "id": "chhattisgarh_dhamtari",
      "name": "Dhamtari",
      "state": "Chhattisgarh",
      "centroid": [
        20.5327,
        81.7859
      ],
      "bbox": [
        20.0417,
        81.4047,
        21.0237,
        82.1672
      ]
    },
    {
      "id": "chhattisgarh_durg",
      "name": "Durg",
      "state": "Chhattisgarh",
      "centroid": [
        21.1994,
        81.3669
      ],
      "bbox": [
        20.375,
        80.7984,
        22.0239,
        81.9354
      ]
    },
    {
      "id": "chhattisgarh_janjgir-champa",
      "name": "Janjgir-Champa",
      "state": "Chhattisgarh",
      "centroid": [
        21.9667,
        82.8076
      ],
      "bbox": [
        21.6755,
        82.3016,
        22.2578,
        83.3137
      ]
    },
    {
      "id": "chhattisgarh_jashpur",
      "name": "Jashpur",
      "state": "Chhattisgarh",
      "centroid": [
        22.767,
        83.8882
      ],
      "bbox": [
        22.2895,
        83.3869,
        23.2445,
        84.3896
      ]
    },
    {
      "id": "chhattisgarh_kanker",
      "name": "Kanker",
      "state": "Chhattisgarh",
      "centroid": [
        20.1219,
        81.102
      ],
      "bbox": [
        19.6908,
        80.3947,
        20.5531,
        81.8094
      ]
    },
    {
      "id": "chhattisgarh_kawardha",
      "name": "Kawardha",
      "state": "Chhattisgarh",
      "centroid": [
        22.1129,
        81.1875
      ],
      "bbox": [
        21.7015,
        80.8184,
        22.5243,
        81.5566
      ]
    },
    {
      "id": "chhattisgarh_korba",
      "name": "Korba",
      "state": "Chhattisgarh",
      "centroid": [
        22.5165,
        82.624
      ],
      "bbox": [
        22.0358,
        82.1309,
        22.9973,
        83.1171
      ]
    },
    {
      "id": "chhattisgarh_koriya",
      "name": "Koriya",
      "state": "Chhattisgarh",
      "centroid": [
        23.4316,
        82.1609
      ],
      "bbox": [
        22.9376,
        81.5697,
        23.9256,
        82.7521
      ]
    },
    {
      "id": "chhattisgarh_mahasamund",
      "name": "Mahasamund",
      "state": "Chhattisgarh",
      "centroid": [
        21.1846,
        82.6294
      ],
      "bbox": [
        20.8212,
        81.984,
        21.5479,
        83.2748
      ]
    },
    {
      "id": "chhattisgarh_raigarh",
      "name": "Raigarh",
      "state": "Chhattisgarh",
      "centroid": [
        22.0643,
        83.3587
      ],
      "bbox": [
        21.3389,
        82.9193,
        22.7898,
        83.798
      ]
    },
    {
      "id": "chhattisgarh_raipur",
      "name": "Raipur",
      "state": "Chhattisgarh",
      "centroid": [
        20.8268,
        82.2524
      ],
      "bbox": [
        19.771,
        81.5275,
        21.8826,
        82.9772
      ]
    },
    {
      "id": "chhattisgarh_raj_nandgaon",
      "name": "Raj Nandgaon",
      "state": "Chhattisgarh",
      "centroid": [
        20.9712,
        80.7966
      ],
      "bbox": [
        20.1098,
        80.383,
        21.8326,
        81.2102
      ]
    },
    {
      "id": "chhattisgarh_surguja",
      "name": "Surguja",
      "state": "Chhattisgarh",
      "centroid": [
        23.3658,
        83.2808
      ],
      "bbox": [
        22.6246,
        82.4913,
        24.107,
        84.0703
      ]
    }
  ],
  "Dadra and Nagar Haveli": [
    {
      "id": "dadra_and_nagar_haveli_dadra_and_nagar_haveli",
      "name": "Dadra and Nagar Haveli",
      "state": "Dadra and Nagar Haveli",
      "centroid": [
        20.2062,
        73.0757
      ],
      "bbox": [
        20.0516,
        72.9223,
        20.3607,
        73.2292
      ]
    }
  ],
  "Daman and Diu": [
    {
      "id": "daman_and_diu_daman",
      "name": "Daman",
      "state": "Daman and Diu",
      "centroid": [
        20.4199,
        72.8484
      ],
      "bbox": [
        20.3687,
        72.8213,
        20.471,
        72.8755
      ]
    },
    {
      "id": "daman_and_diu_junagadh",
      "name": "Junagadh",
      "state": "Daman and Diu",
      "centroid": [
        20.8401,
        70.8356
      ],
      "bbox": [
        20.6901,
        70.6735,
        20.9901,
        70.9976
      ]
    }
  ],
  "Delhi": [
    {
      "id": "delhi_delhi",
      "name": "Delhi",
      "state": "Delhi",
      "centroid": [
        28.6465,
        77.0853
      ],
      "bbox": [
        28.4085,
        76.8329,
        28.8845,
        77.3377
      ]
    }
  ],
  "Goa": [
    {
      "id": "goa_north_goa",
      "name": "North Goa",
      "state": "Goa",
      "centroid": [
        15.5327,
        73.9833
      ],
      "bbox": [
        15.2679,
        73.6793,
        15.7975,
        74.2873
      ]
    },
    {
      "id": "goa_south_goa",
      "name": "South Goa",
      "state": "Goa",
      "centroid": [
        15.1926,
        74.0512
      ],
      "bbox": [
        14.8957,
        73.7607,
        15.4895,
        74.3417
      ]
    }
  ],
  "Gujarat": [
    {
      "id": "gujarat_ahmadabad",
      "name": "Ahmadabad",
      "state": "Gujarat",
      "centroid": [
        22.759,
        72.2353
      ],
      "bbox": [
        22.0121,
        71.6203,
        23.5059,
        72.8504
      ]
    },
    {
      "id": "gujarat_amreli",
      "name": "Amreli",
      "state": "Gujarat",
      "centroid": [
        21.4261,
        71.2486
      ],
      "bbox": [
        20.8137,
        70.7872,
        22.0386,
        71.7101
      ]
    },
    {
      "id": "gujarat_anand",
      "name": "Anand",
      "state": "Gujarat",
      "centroid": [
        22.4669,
        72.7942
      ],
      "bbox": [
        22.1974,
        72.3517,
        22.7364,
        73.2367
      ]
    },
    {
      "id": "gujarat_banas_kantha",
      "name": "Banas Kantha",
      "state": "Gujarat",
      "centroid": [
        24.2658,
        72.1514
      ],
      "bbox": [
        23.8257,
        71.2686,
        24.7058,
        73.0341
      ]
    },
    {
      "id": "gujarat_bharuch",
      "name": "Bharuch",
      "state": "Gujarat",
      "centroid": [
        21.8336,
        73.0067
      ],
      "bbox": [
        21.4193,
        72.5021,
        22.2479,
        73.5112
      ]
    },
    {
      "id": "gujarat_bhavnagar",
      "name": "Bhavnagar",
      "state": "Gujarat",
      "centroid": [
        21.6721,
        71.8985
      ],
      "bbox": [
        20.9951,
        71.4055,
        22.3491,
        72.3915
      ]
    },
    {
      "id": "gujarat_dahod",
      "name": "Dahod",
      "state": "Gujarat",
      "centroid": [
        22.9562,
        74.0279
      ],
      "bbox": [
        22.4537,
        73.5768,
        23.4586,
        74.4789
      ]
    },
    {
      "id": "gujarat_gandhinagar",
      "name": "Gandhinagar",
      "state": "Gujarat",
      "centroid": [
        23.2112,
        72.691
      ],
      "bbox": [
        22.9928,
        72.3447,
        23.4297,
        73.0372
      ]
    },
    {
      "id": "gujarat_jamnagar",
      "name": "Jamnagar",
      "state": "Gujarat",
      "centroid": [
        22.3273,
        69.8069
      ],
      "bbox": [
        21.6887,
        68.936,
        22.9659,
        70.6778
      ]
    },
    {
      "id": "gujarat_junagadh",
      "name": "Junagadh",
      "state": "Gujarat",
      "centroid": [
        21.1896,
        70.6108
      ],
      "bbox": [
        20.7082,
        69.966,
        21.6709,
        71.2557
      ]
    },
    {
      "id": "gujarat_kachchh",
      "name": "Kachchh",
      "state": "Gujarat",
      "centroid": [
        23.7043,
        69.9567
      ],
      "bbox": [
        22.7279,
        68.1862,
        24.6807,
        71.7273
      ]
    },
    {
      "id": "gujarat_kheda",
      "name": "Kheda",
      "state": "Gujarat",
      "centroid": [
        22.8939,
        73.0487
      ],
      "bbox": [
        22.4987,
        72.5163,
        23.289,
        73.581
      ]
    },
    {
      "id": "gujarat_mahesana",
      "name": "Mahesana",
      "state": "Gujarat",
      "centroid": [
        23.5658,
        72.4188
      ],
      "bbox": [
        23.0387,
        71.9672,
        24.093,
        72.8703
      ]
    },
    {
      "id": "gujarat_narmada",
      "name": "Narmada",
      "state": "Gujarat",
      "centroid": [
        21.6885,
        73.6494
      ],
      "bbox": [
        21.3958,
        73.3073,
        21.9811,
        73.9915
      ]
    },
    {
      "id": "gujarat_navsari",
      "name": "Navsari",
      "state": "Gujarat",
      "centroid": [
        20.8255,
        73.1151
      ],
      "bbox": [
        20.5813,
        72.7232,
        21.0697,
        73.507
      ]
    },
    {
      "id": "gujarat_panch_mahals",
      "name": "Panch Mahals",
      "state": "Gujarat",
      "centroid": [
        22.8721,
        73.6456
      ],
      "bbox": [
        22.2852,
        73.3569,
        23.4589,
        73.9342
      ]
    },
    {
      "id": "gujarat_patan",
      "name": "Patan",
      "state": "Gujarat",
      "centroid": [
        23.7683,
        71.7903
      ],
      "bbox": [
        23.3974,
        71.0459,
        24.1392,
        72.5347
      ]
    },
    {
      "id": "gujarat_porbandar",
      "name": "Porbandar",
      "state": "Gujarat",
      "centroid": [
        21.5875,
        69.7827
      ],
      "bbox": [
        21.2074,
        69.3962,
        21.9675,
        70.1693
      ]
    },
    {
      "id": "gujarat_rajkot",
      "name": "Rajkot",
      "state": "Gujarat",
      "centroid": [
        22.3442,
        70.7857
      ],
      "bbox": [
        21.5187,
        70.0517,
        23.1697,
        71.5197
      ]
    },
    {
      "id": "gujarat_sabar_kantha",
      "name": "Sabar Kantha",
      "state": "Gujarat",
      "centroid": [
        23.7771,
        73.1954
      ],
      "bbox": [
        23.0594,
        72.7301,
        24.4947,
        73.6607
      ]
    },
    {
      "id": "gujarat_surat",
      "name": "Surat",
      "state": "Gujarat",
      "centroid": [
        21.1902,
        73.4571
      ],
      "bbox": [
        20.8132,
        72.5788,
        21.5673,
        74.3355
      ]
    },
    {
      "id": "gujarat_surendranagar",
      "name": "Surendranagar",
      "state": "Gujarat",
      "centroid": [
        22.8235,
        71.5788
      ],
      "bbox": [
        22.1179,
        70.9601,
        23.529,
        72.1976
      ]
    },
    {
      "id": "gujarat_the_dangs",
      "name": "The Dangs",
      "state": "Gujarat",
      "centroid": [
        20.7872,
        73.7122
      ],
      "bbox": [
        20.5623,
        73.4748,
        21.012,
        73.9495
      ]
    },
    {
      "id": "gujarat_vadodara",
      "name": "Vadodara",
      "state": "Gujarat",
      "centroid": [
        22.315,
        73.5841
      ],
      "bbox": [
        21.8202,
        72.8739,
        22.8099,
        74.2942
      ]
    },
    {
      "id": "gujarat_valsad",
      "name": "Valsad",
      "state": "Gujarat",
      "centroid": [
        20.4329,
        73.1191
      ],
      "bbox": [
        20.1208,
        72.7376,
        20.7449,
        73.5007
      ]
    }
  ],
  "Haryana": [
    {
      "id": "haryana_ambala",
      "name": "Ambala",
      "state": "Haryana",
      "centroid": [
        30.3818,
        76.9216
      ],
      "bbox": [
        30.127,
        76.5325,
        30.6366,
        77.3107
      ]
    },
    {
      "id": "haryana_bhiwani",
      "name": "Bhiwani",
      "state": "Haryana",
      "centroid": [
        28.7362,
        75.9613
      ],
      "bbox": [
        28.3867,
        75.4671,
        29.0857,
        76.4555
      ]
    },
    {
      "id": "haryana_faridabad",
      "name": "Faridabad",
      "state": "Haryana",
      "centroid": [
        28.1816,
        77.304
      ],
      "bbox": [
        27.852,
        77.0656,
        28.5111,
        77.5424
      ]
    },
    {
      "id": "haryana_fatehabad",
      "name": "Fatehabad",
      "state": "Haryana",
      "centroid": [
        29.5386,
        75.5817
      ],
      "bbox": [
        29.2519,
        75.2122,
        29.8254,
        75.9512
      ]
    },
    {
      "id": "haryana_gurgaon",
      "name": "Gurgaon",
      "state": "Haryana",
      "centroid": [
        28.0994,
        76.9828
      ],
      "bbox": [
        27.656,
        76.6365,
        28.5428,
        77.3292
      ]
    },
    {
      "id": "haryana_hisar",
      "name": "Hisar",
      "state": "Haryana",
      "centroid": [
        29.2432,
        75.7812
      ],
      "bbox": [
        28.903,
        75.2548,
        29.5834,
        76.3076
      ]
    },
    {
      "id": "haryana_jhajjar",
      "name": "Jhajjar",
      "state": "Haryana",
      "centroid": [
        28.5984,
        76.615
      ],
      "bbox": [
        28.3298,
        76.2755,
        28.8671,
        76.9546
      ]
    },
    {
      "id": "haryana_jind",
      "name": "Jind",
      "state": "Haryana",
      "centroid": [
        29.4549,
        76.3351
      ],
      "bbox": [
        29.0644,
        75.9253,
        29.8453,
        76.745
      ]
    },
    {
      "id": "haryana_kaithal",
      "name": "Kaithal",
      "state": "Haryana",
      "centroid": [
        29.8606,
        76.4551
      ],
      "bbox": [
        29.5189,
        76.1663,
        30.2023,
        76.7439
      ]
    },
    {
      "id": "haryana_karnal",
      "name": "Karnal",
      "state": "Haryana",
      "centroid": [
        29.7206,
        76.8465
      ],
      "bbox": [
        29.4457,
        76.4819,
        29.9955,
        77.2111
      ]
    },
    {
      "id": "haryana_kurukshetra",
      "name": "Kurukshetra",
      "state": "Haryana",
      "centroid": [
        30.0574,
        76.8428
      ],
      "bbox": [
        29.8619,
        76.4125,
        30.253,
        77.2731
      ]
    },
    {
      "id": "haryana_mahendragarh",
      "name": "Mahendragarh",
      "state": "Haryana",
      "centroid": [
        28.1397,
        76.1387
      ],
      "bbox": [
        27.8075,
        75.889,
        28.4719,
        76.3884
      ]
    },
    {
      "id": "haryana_panchkula",
      "name": "Panchkula",
      "state": "Haryana",
      "centroid": [
        30.7276,
        76.9625
      ],
      "bbox": [
        30.5247,
        76.7625,
        30.9304,
        77.1624
      ]
    },
    {
      "id": "haryana_panipat",
      "name": "Panipat",
      "state": "Haryana",
      "centroid": [
        29.3319,
        76.8895
      ],
      "bbox": [
        29.1686,
        76.6247,
        29.4951,
        77.1542
      ]
    },
    {
      "id": "haryana_rewari",
      "name": "Rewari",
      "state": "Haryana",
      "centroid": [
        28.2022,
        76.5769
      ],
      "bbox": [
        27.9705,
        76.2995,
        28.4338,
        76.8543
      ]
    },
    {
      "id": "haryana_rohtak",
      "name": "Rohtak",
      "state": "Haryana",
      "centroid": [
        28.8973,
        76.551
      ],
      "bbox": [
        28.6858,
        76.2092,
        29.1089,
        76.8928
      ]
    },
    {
      "id": "haryana_sirsa",
      "name": "Sirsa",
      "state": "Haryana",
      "centroid": [
        29.6097,
        74.8788
      ],
      "bbox": [
        29.2268,
        74.4653,
        29.9926,
        75.2923
      ]
    },
    {
      "id": "haryana_sonepat",
      "name": "Sonepat",
      "state": "Haryana",
      "centroid": [
        29.0562,
        76.8435
      ],
      "bbox": [
        28.8177,
        76.4656,
        29.2947,
        77.2215
      ]
    },
    {
      "id": "haryana_yamuna_nagar",
      "name": "Yamuna Nagar",
      "state": "Haryana",
      "centroid": [
        30.2563,
        77.3268
      ],
      "bbox": [
        30.0468,
        77.0615,
        30.4657,
        77.592
      ]
    }
  ],
  "Himachal Pradesh": [
    {
      "id": "himachal_pradesh_bilaspur",
      "name": "Bilaspur",
      "state": "Himachal Pradesh",
      "centroid": [
        31.4074,
        76.6465
      ],
      "bbox": [
        31.213,
        76.3792,
        31.6018,
        76.9137
      ]
    },
    {
      "id": "himachal_pradesh_chamba",
      "name": "Chamba",
      "state": "Himachal Pradesh",
      "centroid": [
        32.6953,
        76.327
      ],
      "bbox": [
        32.1811,
        75.7874,
        33.2095,
        76.8666
      ]
    },
    {
      "id": "himachal_pradesh_hamirpur",
      "name": "Hamirpur",
      "state": "Himachal Pradesh",
      "centroid": [
        31.66,
        76.5007
      ],
      "bbox": [
        31.4216,
        76.2863,
        31.8985,
        76.715
      ]
    },
    {
      "id": "himachal_pradesh_kangra",
      "name": "Kangra",
      "state": "Himachal Pradesh",
      "centroid": [
        32.0805,
        76.3215
      ],
      "bbox": [
        31.6887,
        75.5788,
        32.4723,
        77.0642
      ]
    },
    {
      "id": "himachal_pradesh_kinnaur",
      "name": "Kinnaur",
      "state": "Himachal Pradesh",
      "centroid": [
        31.5987,
        78.3659
      ],
      "bbox": [
        31.1038,
        77.7352,
        32.0936,
        78.9967
      ]
    },
    {
      "id": "himachal_pradesh_kullu",
      "name": "Kullu",
      "state": "Himachal Pradesh",
      "centroid": [
        31.882,
        77.3879
      ],
      "bbox": [
        31.3455,
        76.9229,
        32.4185,
        77.853
      ]
    },
    {
      "id": "himachal_pradesh_lahul_and_spiti",
      "name": "Lahul and Spiti",
      "state": "Himachal Pradesh",
      "centroid": [
        32.5033,
        77.5047
      ],
      "bbox": [
        31.751,
        76.3583,
        33.2557,
        78.6511
      ]
    },
    {
      "id": "himachal_pradesh_mandi",
      "name": "Mandi",
      "state": "Himachal Pradesh",
      "centroid": [
        31.6547,
        76.9912
      ],
      "bbox": [
        31.2322,
        76.6062,
        32.0771,
        77.3761
      ]
    },
    {
      "id": "himachal_pradesh_shimla",
      "name": "Shimla",
      "state": "Himachal Pradesh",
      "centroid": [
        31.2438,
        77.6385
      ],
      "bbox": [
        30.7687,
        76.9785,
        31.7189,
        78.2984
      ]
    },
    {
      "id": "himachal_pradesh_sirmaur",
      "name": "Sirmaur",
      "state": "Himachal Pradesh",
      "centroid": [
        30.7055,
        77.4085
      ],
      "bbox": [
        30.3845,
        77.0047,
        31.0265,
        77.8122
      ]
    },
    {
      "id": "himachal_pradesh_solan",
      "name": "Solan",
      "state": "Himachal Pradesh",
      "centroid": [
        31.061,
        76.9137
      ],
      "bbox": [
        30.7516,
        76.5893,
        31.3704,
        77.2381
      ]
    },
    {
      "id": "himachal_pradesh_una",
      "name": "Una",
      "state": "Himachal Pradesh",
      "centroid": [
        31.5851,
        76.1934
      ],
      "bbox": [
        31.3047,
        75.9218,
        31.8654,
        76.4649
      ]
    }
  ],
  "Jammu and Kashmir": [
    {
      "id": "jammu_and_kashmir_anantnag_(kashmir_south)",
      "name": "Anantnag (Kashmir South)",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.8715,
        75.2184
      ],
      "bbox": [
        33.3692,
        74.6939,
        34.3738,
        75.7429
      ]
    },
    {
      "id": "jammu_and_kashmir_bagdam",
      "name": "Bagdam",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.9195,
        74.7688
      ],
      "bbox": [
        33.6865,
        74.5297,
        34.1525,
        75.0079
      ]
    },
    {
      "id": "jammu_and_kashmir_baramula_(kashmir_north)",
      "name": "Baramula (Kashmir North)",
      "state": "Jammu and Kashmir",
      "centroid": [
        34.3617,
        74.6834
      ],
      "bbox": [
        34.0008,
        73.8843,
        34.7226,
        75.4825
      ]
    },
    {
      "id": "jammu_and_kashmir_doda",
      "name": "Doda",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.5379,
        75.9895
      ],
      "bbox": [
        32.8842,
        75.1706,
        34.1916,
        76.8085
      ]
    },
    {
      "id": "jammu_and_kashmir_jammu",
      "name": "Jammu",
      "state": "Jammu and Kashmir",
      "centroid": [
        32.7287,
        74.8736
      ],
      "bbox": [
        32.4041,
        74.3161,
        33.0532,
        75.4311
      ]
    },
    {
      "id": "jammu_and_kashmir_kargil",
      "name": "Kargil",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.776,
        76.5011
      ],
      "bbox": [
        32.8189,
        75.4413,
        34.7331,
        77.561
      ]
    },
    {
      "id": "jammu_and_kashmir_kathua",
      "name": "Kathua",
      "state": "Jammu and Kashmir",
      "centroid": [
        32.5723,
        75.5614
      ],
      "bbox": [
        32.2753,
        75.1974,
        32.8693,
        75.9254
      ]
    },
    {
      "id": "jammu_and_kashmir_kupwara_(muzaffarabad)",
      "name": "Kupwara (Muzaffarabad)",
      "state": "Jammu and Kashmir",
      "centroid": [
        34.5525,
        74.2056
      ],
      "bbox": [
        34.3016,
        73.7632,
        34.8034,
        74.648
      ]
    },
    {
      "id": "jammu_and_kashmir_ladakh_(leh)",
      "name": "Ladakh (Leh)",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.922,
        77.9465
      ],
      "bbox": [
        32.3428,
        76.3287,
        35.5013,
        79.5643
      ]
    },
    {
      "id": "jammu_and_kashmir_pulwama",
      "name": "Pulwama",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.8471,
        74.9831
      ],
      "bbox": [
        33.6404,
        74.7236,
        34.0539,
        75.2426
      ]
    },
    {
      "id": "jammu_and_kashmir_punch",
      "name": "Punch",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.743,
        74.3055
      ],
      "bbox": [
        33.3811,
        73.8832,
        34.105,
        74.7277
      ]
    },
    {
      "id": "jammu_and_kashmir_rajauri",
      "name": "Rajauri",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.2625,
        74.4079
      ],
      "bbox": [
        32.9458,
        74.011,
        33.5791,
        74.8048
      ]
    },
    {
      "id": "jammu_and_kashmir_srinagar",
      "name": "Srinagar",
      "state": "Jammu and Kashmir",
      "centroid": [
        34.2516,
        75.1322
      ],
      "bbox": [
        34.0367,
        74.787,
        34.4664,
        75.4775
      ]
    },
    {
      "id": "jammu_and_kashmir_udhampur",
      "name": "Udhampur",
      "state": "Jammu and Kashmir",
      "centroid": [
        33.0671,
        75.237
      ],
      "bbox": [
        32.609,
        74.6756,
        33.5251,
        75.7984
      ]
    }
  ],
  "Jharkhand": [
    {
      "id": "jharkhand_bokaro",
      "name": "Bokaro",
      "state": "Jharkhand",
      "centroid": [
        23.6934,
        86.0216
      ],
      "bbox": [
        23.4192,
        85.5768,
        23.9675,
        86.4664
      ]
    },
    {
      "id": "jharkhand_chatra",
      "name": "Chatra",
      "state": "Jharkhand",
      "centroid": [
        24.1033,
        84.8912
      ],
      "bbox": [
        23.6772,
        84.4374,
        24.5295,
        85.3451
      ]
    },
    {
      "id": "jharkhand_deoghar",
      "name": "Deoghar",
      "state": "Jharkhand",
      "centroid": [
        24.3315,
        86.7589
      ],
      "bbox": [
        24.0431,
        86.4522,
        24.6198,
        87.0656
      ]
    },
    {
      "id": "jharkhand_dhanbad",
      "name": "Dhanbad",
      "state": "Jharkhand",
      "centroid": [
        23.8434,
        86.4642
      ],
      "bbox": [
        23.6284,
        86.1085,
        24.0583,
        86.8198
      ]
    },
    {
      "id": "jharkhand_dumka",
      "name": "Dumka",
      "state": "Jharkhand",
      "centroid": [
        24.3106,
        87.288
      ],
      "bbox": [
        23.9781,
        86.8793,
        24.6431,
        87.6967
      ]
    },
    {
      "id": "jharkhand_garhwa",
      "name": "Garhwa",
      "state": "Jharkhand",
      "centroid": [
        24.0503,
        83.6929
      ],
      "bbox": [
        23.563,
        83.3236,
        24.5376,
        84.0623
      ]
    },
    {
      "id": "jharkhand_giridih",
      "name": "Giridih",
      "state": "Jharkhand",
      "centroid": [
        24.3327,
        86.1165
      ],
      "bbox": [
        23.886,
        85.6632,
        24.7795,
        86.5697
      ]
    },
    {
      "id": "jharkhand_godda",
      "name": "Godda",
      "state": "Jharkhand",
      "centroid": [
        24.8639,
        87.2809
      ],
      "bbox": [
        24.5003,
        87.0444,
        25.2275,
        87.5173
      ]
    },
    {
      "id": "jharkhand_gumla",
      "name": "Gumla",
      "state": "Jharkhand",
      "centroid": [
        23.1572,
        84.5195
      ],
      "bbox": [
        22.7064,
        84.0291,
        23.6081,
        85.0098
      ]
    },
    {
      "id": "jharkhand_hazaribag",
      "name": "Hazaribag",
      "state": "Jharkhand",
      "centroid": [
        23.9823,
        85.4695
      ],
      "bbox": [
        23.4188,
        85.0111,
        24.5457,
        85.928
      ]
    },
    {
      "id": "jharkhand_jamtara",
      "name": "Jamtara",
      "state": "Jharkhand",
      "centroid": [
        23.981,
        86.8797
      ],
      "bbox": [
        23.7944,
        86.4649,
        24.1676,
        87.2945
      ]
    },
    {
      "id": "jharkhand_koderma",
      "name": "Koderma",
      "state": "Jharkhand",
      "centroid": [
        24.5542,
        85.6733
      ],
      "bbox": [
        24.2857,
        85.4421,
        24.8227,
        85.9046
      ]
    },
    {
      "id": "jharkhand_latehar",
      "name": "Latehar",
      "state": "Jharkhand",
      "centroid": [
        23.6856,
        84.4622
      ],
      "bbox": [
        23.3235,
        83.9658,
        24.0477,
        84.9587
      ]
    },
    {
      "id": "jharkhand_lohardaga",
      "name": "Lohardaga",
      "state": "Jharkhand",
      "centroid": [
        23.4769,
        84.6635
      ],
      "bbox": [
        23.2784,
        84.3885,
        23.6754,
        84.9385
      ]
    },
    {
      "id": "jharkhand_pakur",
      "name": "Pakur",
      "state": "Jharkhand",
      "centroid": [
        24.5312,
        87.6488
      ],
      "bbox": [
        24.2354,
        87.3843,
        24.827,
        87.9134
      ]
    },
    {
      "id": "jharkhand_palamu",
      "name": "Palamu",
      "state": "Jharkhand",
      "centroid": [
        24.1898,
        84.1933
      ],
      "bbox": [
        23.7415,
        83.8056,
        24.638,
        84.581
      ]
    },
    {
      "id": "jharkhand_pashchim_singhbhum",
      "name": "Pashchim Singhbhum",
      "state": "Jharkhand",
      "centroid": [
        22.4246,
        85.5115
      ],
      "bbox": [
        21.9666,
        84.9798,
        22.8826,
        86.0433
      ]
    },
    {
      "id": "jharkhand_purba_singhbhum",
      "name": "Purba Singhbhum",
      "state": "Jharkhand",
      "centroid": [
        22.6106,
        86.4752
      ],
      "bbox": [
        22.208,
        86.0618,
        23.0133,
        86.8886
      ]
    },
    {
      "id": "jharkhand_ranchi",
      "name": "Ranchi",
      "state": "Jharkhand",
      "centroid": [
        23.141,
        85.3792
      ],
      "bbox": [
        22.5679,
        84.8626,
        23.7141,
        85.8959
      ]
    },
    {
      "id": "jharkhand_sahibganj",
      "name": "Sahibganj",
      "state": "Jharkhand",
      "centroid": [
        25.031,
        87.7113
      ],
      "bbox": [
        24.7135,
        87.4492,
        25.3484,
        87.9733
      ]
    },
    {
      "id": "jharkhand_saraikela_kharsawan",
      "name": "Saraikela Kharsawan",
      "state": "Jharkhand",
      "centroid": [
        22.8156,
        85.8746
      ],
      "bbox": [
        22.4786,
        85.5087,
        23.1525,
        86.2405
      ]
    },
    {
      "id": "jharkhand_simdega",
      "name": "Simdega",
      "state": "Jharkhand",
      "centroid": [
        22.5853,
        84.5371
      ],
      "bbox": [
        22.3373,
        83.9994,
        22.8334,
        85.0748
      ]
    }
  ],
  "Karnataka": [
    {
      "id": "karnataka_bagalkot",
      "name": "Bagalkot",
      "state": "Karnataka",
      "centroid": [
        16.288,
        75.6649
      ],
      "bbox": [
        15.8104,
        74.9966,
        16.7656,
        76.3332
      ]
    },
    {
      "id": "karnataka_bangalore_rural",
      "name": "Bangalore Rural",
      "state": "Karnataka",
      "centroid": [
        12.8641,
        77.5105
      ],
      "bbox": [
        12.2358,
        77.0641,
        13.4924,
        77.9569
      ]
    },
    {
      "id": "karnataka_bangalore_urban",
      "name": "Bangalore Urban",
      "state": "Karnataka",
      "centroid": [
        12.9358,
        77.5739
      ],
      "bbox": [
        12.6483,
        77.3222,
        13.2233,
        77.8256
      ]
    },
    {
      "id": "karnataka_belgaum",
      "name": "Belgaum",
      "state": "Karnataka",
      "centroid": [
        16.1555,
        74.7793
      ],
      "bbox": [
        15.3562,
        74.0965,
        16.9548,
        75.4621
      ]
    },
    {
      "id": "karnataka_bellary",
      "name": "Bellary",
      "state": "Karnataka",
      "centroid": [
        15.1929,
        76.415
      ],
      "bbox": [
        14.5563,
        75.6646,
        15.8295,
        77.1653
      ]
    },
    {
      "id": "karnataka_bidar",
      "name": "Bidar",
      "state": "Karnataka",
      "centroid": [
        18.0179,
        77.172
      ],
      "bbox": [
        17.5808,
        76.6906,
        18.4551,
        77.6534
      ]
    },
    {
      "id": "karnataka_bijapur",
      "name": "Bijapur",
      "state": "Karnataka",
      "centroid": [
        16.812,
        75.9025
      ],
      "bbox": [
        16.1466,
        75.3363,
        17.4775,
        76.4688
      ]
    },
    {
      "id": "karnataka_chamrajnagar",
      "name": "Chamrajnagar",
      "state": "Karnataka",
      "centroid": [
        11.9394,
        77.0824
      ],
      "bbox": [
        11.5745,
        76.3964,
        12.3042,
        77.7684
      ]
    },
    {
      "id": "karnataka_chikmagalur",
      "name": "Chikmagalur",
      "state": "Karnataka",
      "centroid": [
        13.4023,
        75.7202
      ],
      "bbox": [
        12.91,
        75.0807,
        13.8945,
        76.3598
      ]
    },
    {
      "id": "karnataka_chitradurga",
      "name": "Chitradurga",
      "state": "Karnataka",
      "centroid": [
        14.2995,
        76.5215
      ],
      "bbox": [
        13.569,
        76.0229,
        15.0301,
        77.02
      ]
    },
    {
      "id": "karnataka_dakshin_kannad",
      "name": "Dakshin Kannad",
      "state": "Karnataka",
      "centroid": [
        12.8169,
        75.2223
      ],
      "bbox": [
        12.455,
        74.7746,
        13.1788,
        75.6699
      ]
    },
    {
      "id": "karnataka_davanagere",
      "name": "Davanagere",
      "state": "Karnataka",
      "centroid": [
        14.3106,
        75.9654
      ],
      "bbox": [
        13.6969,
        75.4003,
        14.9244,
        76.5304
      ]
    },
    {
      "id": "karnataka_dharwad",
      "name": "Dharwad",
      "state": "Karnataka",
      "centroid": [
        15.367,
        75.1444
      ],
      "bbox": [
        15.0347,
        74.7314,
        15.6993,
        75.5573
      ]
    },
    {
      "id": "karnataka_gadag",
      "name": "Gadag",
      "state": "Karnataka",
      "centroid": [
        15.4119,
        75.6608
      ],
      "bbox": [
        14.9396,
        75.2763,
        15.8842,
        76.0453
      ]
    },
    {
      "id": "karnataka_gulbarga",
      "name": "Gulbarga",
      "state": "Karnataka",
      "centroid": [
        16.9781,
        76.8773
      ],
      "bbox": [
        16.1879,
        76.0666,
        17.7683,
        77.688
      ]
    },
    {
      "id": "karnataka_hassan",
      "name": "Hassan",
      "state": "Karnataka",
      "centroid": [
        13.0239,
        76.0914
      ],
      "bbox": [
        12.506,
        75.5538,
        13.5418,
        76.629
      ]
    },
    {
      "id": "karnataka_haveri",
      "name": "Haveri",
      "state": "Karnataka",
      "centroid": [
        14.7137,
        75.4196
      ],
      "bbox": [
        14.2711,
        75.0201,
        15.1563,
        75.8192
      ]
    },
    {
      "id": "karnataka_kodagu",
      "name": "Kodagu",
      "state": "Karnataka",
      "centroid": [
        12.3755,
        75.7743
      ],
      "bbox": [
        11.9233,
        75.3656,
        12.8276,
        76.1831
      ]
    },
    {
      "id": "karnataka_kolar",
      "name": "Kolar",
      "state": "Karnataka",
      "centroid": [
        13.3516,
        77.9664
      ],
      "bbox": [
        12.7526,
        77.3552,
        13.9506,
        78.5775
      ]
    },
    {
      "id": "karnataka_koppal",
      "name": "Koppal",
      "state": "Karnataka",
      "centroid": [
        15.5701,
        76.2915
      ],
      "bbox": [
        15.1333,
        75.7724,
        16.0069,
        76.8106
      ]
    },
    {
      "id": "karnataka_mandya",
      "name": "Mandya",
      "state": "Karnataka",
      "centroid": [
        12.6289,
        76.8252
      ],
      "bbox": [
        12.2106,
        76.3262,
        13.0472,
        77.3242
      ]
    },
    {
      "id": "karnataka_mysore",
      "name": "Mysore",
      "state": "Karnataka",
      "centroid": [
        12.19,
        76.5163
      ],
      "bbox": [
        11.7305,
        75.9068,
        12.6496,
        77.1258
      ]
    },
    {
      "id": "karnataka_raichur",
      "name": "Raichur",
      "state": "Karnataka",
      "centroid": [
        16.0498,
        76.9133
      ],
      "bbox": [
        15.5422,
        76.2343,
        16.5574,
        77.5923
      ]
    },
    {
      "id": "karnataka_shimoga",
      "name": "Shimoga",
      "state": "Karnataka",
      "centroid": [
        14.0527,
        75.1823
      ],
      "bbox": [
        13.4554,
        74.6304,
        14.6501,
        75.7343
      ]
    },
    {
      "id": "karnataka_tumkur",
      "name": "Tumkur",
      "state": "Karnataka",
      "centroid": [
        13.5378,
        76.9262
      ],
      "bbox": [
        12.738,
        76.3419,
        14.3377,
        77.5104
      ]
    },
    {
      "id": "karnataka_udupi",
      "name": "Udupi",
      "state": "Karnataka",
      "centroid": [
        13.4805,
        74.892
      ],
      "bbox": [
        12.9799,
        74.5843,
        13.981,
        75.1997
      ]
    },
    {
      "id": "karnataka_uttar_kannand",
      "name": "Uttar Kannand",
      "state": "Karnataka",
      "centroid": [
        14.7227,
        74.5813
      ],
      "bbox": [
        13.9226,
        74.0543,
        15.5228,
        75.1083
      ]
    }
  ],
  "Kerala": [
    {
      "id": "kerala_alappuzha",
      "name": "Alappuzha",
      "state": "Kerala",
      "centroid": [
        9.4948,
        76.4751
      ],
      "bbox": [
        9.0998,
        76.2709,
        9.8899,
        76.6793
      ]
    },
    {
      "id": "kerala_ernakulam",
      "name": "Ernakulam",
      "state": "Kerala",
      "centroid": [
        10.0434,
        76.4966
      ],
      "bbox": [
        9.7926,
        76.166,
        10.2943,
        76.8273
      ]
    },
    {
      "id": "kerala_idukki",
      "name": "Idukki",
      "state": "Kerala",
      "centroid": [
        9.8043,
        77.0071
      ],
      "bbox": [
        9.2624,
        76.618,
        10.3463,
        77.3962
      ]
    },
    {
      "id": "kerala_kannur",
      "name": "Kannur",
      "state": "Kerala",
      "centroid": [
        11.9821,
        75.5519
      ],
      "bbox": [
        11.6687,
        75.1722,
        12.2954,
        75.9316
      ]
    },
    {
      "id": "kerala_kasaragod",
      "name": "Kasaragod",
      "state": "Kerala",
      "centroid": [
        12.4203,
        75.1484
      ],
      "bbox": [
        12.0499,
        74.8665,
        12.7908,
        75.4304
      ]
    },
    {
      "id": "kerala_kollam",
      "name": "Kollam",
      "state": "Kerala",
      "centroid": [
        8.9582,
        76.8597
      ],
      "bbox": [
        8.7529,
        76.4724,
        9.1636,
        77.247
      ]
    },
    {
      "id": "kerala_kottayam",
      "name": "Kottayam",
      "state": "Kerala",
      "centroid": [
        9.6216,
        76.6698
      ],
      "bbox": [
        9.3931,
        76.3679,
        9.8502,
        76.9717
      ]
    },
    {
      "id": "kerala_kozhikode",
      "name": "Kozhikode",
      "state": "Kerala",
      "centroid": [
        11.4615,
        75.8337
      ],
      "bbox": [
        11.1254,
        75.5299,
        11.7976,
        76.1374
      ]
    },
    {
      "id": "kerala_malappuram",
      "name": "Malappuram",
      "state": "Kerala",
      "centroid": [
        11.0992,
        76.183
      ],
      "bbox": [
        10.6796,
        75.8251,
        11.5187,
        76.5408
      ]
    },
    {
      "id": "kerala_palakkad",
      "name": "Palakkad",
      "state": "Kerala",
      "centroid": [
        10.779,
        76.4582
      ],
      "bbox": [
        10.3268,
        76.0189,
        11.2313,
        76.8975
      ]
    },
    {
      "id": "kerala_pattanamtitta",
      "name": "Pattanamtitta",
      "state": "Kerala",
      "centroid": [
        9.2718,
        76.8651
      ],
      "bbox": [
        9.0605,
        76.4625,
        9.4831,
        77.2678
      ]
    },
    {
      "id": "kerala_thiruvananthapuram",
      "name": "Thiruvananthapuram",
      "state": "Kerala",
      "centroid": [
        8.5749,
        76.9709
      ],
      "bbox": [
        8.2975,
        76.6766,
        8.8523,
        77.2652
      ]
    },
    {
      "id": "kerala_thrissur",
      "name": "Thrissur",
      "state": "Kerala",
      "centroid": [
        10.472,
        76.4245
      ],
      "bbox": [
        10.1673,
        75.9571,
        10.7767,
        76.8918
      ]
    },
    {
      "id": "kerala_wayanad",
      "name": "Wayanad",
      "state": "Kerala",
      "centroid": [
        11.7066,
        76.1039
      ],
      "bbox": [
        11.4427,
        75.7722,
        11.9706,
        76.4356
      ]
    }
  ],
  "Lakshadweep": [
    {
      "id": "lakshadweep_kavaratti",
      "name": "Kavaratti",
      "state": "Lakshadweep",
      "centroid": [
        9.9862,
        72.9014
      ],
      "bbox": [
        8.266,
        72.1001,
        11.7063,
        73.7026
      ]
    }
  ],
  "Madhya Pradesh": [
    {
      "id": "madhya_pradesh_anuppur",
      "name": "Anuppur",
      "state": "Madhya Pradesh",
      "centroid": [
        23.1503,
        81.8605
      ],
      "bbox": [
        22.8771,
        81.5311,
        23.4235,
        82.19
      ]
    },
    {
      "id": "madhya_pradesh_ashoknagar",
      "name": "Ashoknagar",
      "state": "Madhya Pradesh",
      "centroid": [
        24.6234,
        77.87
      ],
      "bbox": [
        24.2357,
        77.4701,
        25.0111,
        78.2699
      ]
    },
    {
      "id": "madhya_pradesh_balaghat",
      "name": "Balaghat",
      "state": "Madhya Pradesh",
      "centroid": [
        21.8589,
        80.2731
      ],
      "bbox": [
        21.3192,
        79.5058,
        22.3986,
        81.0404
      ]
    },
    {
      "id": "madhya_pradesh_barwani",
      "name": "Barwani",
      "state": "Madhya Pradesh",
      "centroid": [
        21.7544,
        75.0331
      ],
      "bbox": [
        21.3725,
        74.4355,
        22.1363,
        75.6307
      ]
    },
    {
      "id": "madhya_pradesh_betul",
      "name": "Betul",
      "state": "Madhya Pradesh",
      "centroid": [
        21.882,
        77.7989
      ],
      "bbox": [
        21.3591,
        77.0562,
        22.4048,
        78.5416
      ]
    },
    {
      "id": "madhya_pradesh_bhind",
      "name": "Bhind",
      "state": "Madhya Pradesh",
      "centroid": [
        26.3552,
        78.6689
      ],
      "bbox": [
        25.9103,
        78.2041,
        26.8002,
        79.1337
      ]
    },
    {
      "id": "madhya_pradesh_bhopal",
      "name": "Bhopal",
      "state": "Madhya Pradesh",
      "centroid": [
        23.4967,
        77.4057
      ],
      "bbox": [
        23.0931,
        77.1654,
        23.9002,
        77.646
      ]
    },
    {
      "id": "madhya_pradesh_burhanpur",
      "name": "Burhanpur",
      "state": "Madhya Pradesh",
      "centroid": [
        21.3377,
        76.37
      ],
      "bbox": [
        21.0753,
        75.9483,
        21.6001,
        76.7918
      ]
    },
    {
      "id": "madhya_pradesh_chhatarpur",
      "name": "Chhatarpur",
      "state": "Madhya Pradesh",
      "centroid": [
        24.7657,
        79.7028
      ],
      "bbox": [
        24.1026,
        78.982,
        25.4287,
        80.4237
      ]
    },
    {
      "id": "madhya_pradesh_chhindwara",
      "name": "Chhindwara",
      "state": "Madhya Pradesh",
      "centroid": [
        22.141,
        78.8235
      ],
      "bbox": [
        21.4644,
        78.2442,
        22.8176,
        79.4027
      ]
    },
    {
      "id": "madhya_pradesh_damoh",
      "name": "Damoh",
      "state": "Madhya Pradesh",
      "centroid": [
        23.8,
        79.4998
      ],
      "bbox": [
        23.1503,
        79.0504,
        24.4496,
        79.9493
      ]
    },
    {
      "id": "madhya_pradesh_datia",
      "name": "Datia",
      "state": "Madhya Pradesh",
      "centroid": [
        25.9235,
        78.5479
      ],
      "bbox": [
        25.552,
        78.2085,
        26.295,
        78.8872
      ]
    },
    {
      "id": "madhya_pradesh_dewas",
      "name": "Dewas",
      "state": "Madhya Pradesh",
      "centroid": [
        22.8102,
        76.5115
      ],
      "bbox": [
        22.2952,
        75.8987,
        23.3252,
        77.1244
      ]
    },
    {
      "id": "madhya_pradesh_dhar",
      "name": "Dhar",
      "state": "Madhya Pradesh",
      "centroid": [
        22.5808,
        75.0942
      ],
      "bbox": [
        22.022,
        74.4746,
        23.1397,
        75.7139
      ]
    },
    {
      "id": "madhya_pradesh_dindori",
      "name": "Dindori",
      "state": "Madhya Pradesh",
      "centroid": [
        22.8069,
        81.1024
      ],
      "bbox": [
        22.2406,
        80.4729,
        23.3731,
        81.7318
      ]
    },
    {
      "id": "madhya_pradesh_east_nimar",
      "name": "East Nimar",
      "state": "Madhya Pradesh",
      "centroid": [
        21.9808,
        76.6209
      ],
      "bbox": [
        21.5432,
        76.0232,
        22.4183,
        77.2187
      ]
    },
    {
      "id": "madhya_pradesh_guna",
      "name": "Guna",
      "state": "Madhya Pradesh",
      "centroid": [
        24.5044,
        77.2656
      ],
      "bbox": [
        23.8896,
        76.8007,
        25.1193,
        77.7304
      ]
    },
    {
      "id": "madhya_pradesh_gwalior",
      "name": "Gwalior",
      "state": "Madhya Pradesh",
      "centroid": [
        26.0344,
        78.1527
      ],
      "bbox": [
        25.7161,
        77.6616,
        26.3527,
        78.6438
      ]
    },
    {
      "id": "madhya_pradesh_harda",
      "name": "Harda",
      "state": "Madhya Pradesh",
      "centroid": [
        22.248,
        77.1394
      ],
      "bbox": [
        21.9079,
        76.7796,
        22.588,
        77.4992
      ]
    },
    {
      "id": "madhya_pradesh_hoshangabad",
      "name": "Hoshangabad",
      "state": "Madhya Pradesh",
      "centroid": [
        22.6043,
        77.9475
      ],
      "bbox": [
        22.2202,
        77.2034,
        22.9883,
        78.6916
      ]
    },
    {
      "id": "madhya_pradesh_indore",
      "name": "Indore",
      "state": "Madhya Pradesh",
      "centroid": [
        22.7145,
        75.8336
      ],
      "bbox": [
        22.3356,
        75.4232,
        23.0934,
        76.2439
      ]
    },
    {
      "id": "madhya_pradesh_jabalpur",
      "name": "Jabalpur",
      "state": "Madhya Pradesh",
      "centroid": [
        23.151,
        79.9611
      ],
      "bbox": [
        22.8321,
        79.3451,
        23.4699,
        80.577
      ]
    },
    {
      "id": "madhya_pradesh_jhabua",
      "name": "Jhabua",
      "state": "Madhya Pradesh",
      "centroid": [
        22.5833,
        74.5246
      ],
      "bbox": [
        21.9254,
        74.0347,
        23.2412,
        75.0144
      ]
    },
    {
      "id": "madhya_pradesh_katni",
      "name": "Katni",
      "state": "Madhya Pradesh",
      "centroid": [
        23.7206,
        80.372
      ],
      "bbox": [
        23.3029,
        79.7934,
        24.1382,
        80.9506
      ]
    },
    {
      "id": "madhya_pradesh_mandla",
      "name": "Mandla",
      "state": "Madhya Pradesh",
      "centroid": [
        22.6896,
        80.4726
      ],
      "bbox": [
        22.2045,
        79.9459,
        23.1746,
        80.9994
      ]
    },
    {
      "id": "madhya_pradesh_mandsaur",
      "name": "Mandsaur",
      "state": "Madhya Pradesh",
      "centroid": [
        24.2647,
        75.4026
      ],
      "bbox": [
        23.7639,
        74.8802,
        24.7655,
        75.925
      ]
    },
    {
      "id": "madhya_pradesh_morena",
      "name": "Morena",
      "state": "Madhya Pradesh",
      "centroid": [
        26.3909,
        77.8222
      ],
      "bbox": [
        25.9073,
        77.1094,
        26.8744,
        78.535
      ]
    },
    {
      "id": "madhya_pradesh_narsinghpur",
      "name": "Narsinghpur",
      "state": "Madhya Pradesh",
      "centroid": [
        22.9367,
        79.0353
      ],
      "bbox": [
        22.6179,
        78.437,
        23.2555,
        79.6336
      ]
    },
    {
      "id": "madhya_pradesh_neemuch",
      "name": "Neemuch",
      "state": "Madhya Pradesh",
      "centroid": [
        24.6499,
        75.1607
      ],
      "bbox": [
        24.2459,
        74.7119,
        25.0538,
        75.6095
      ]
    },
    {
      "id": "madhya_pradesh_panna",
      "name": "Panna",
      "state": "Madhya Pradesh",
      "centroid": [
        24.4524,
        80.2003
      ],
      "bbox": [
        23.8226,
        79.7309,
        25.0821,
        80.6696
      ]
    },
    {
      "id": "madhya_pradesh_raisen",
      "name": "Raisen",
      "state": "Madhya Pradesh",
      "centroid": [
        23.271,
        78.0833
      ],
      "bbox": [
        22.7931,
        77.3574,
        23.749,
        78.8092
      ]
    },
    {
      "id": "madhya_pradesh_rajgarh",
      "name": "Rajgarh",
      "state": "Madhya Pradesh",
      "centroid": [
        23.8724,
        76.7122
      ],
      "bbox": [
        23.4598,
        76.2012,
        24.285,
        77.2232
      ]
    },
    {
      "id": "madhya_pradesh_ratlam",
      "name": "Ratlam",
      "state": "Madhya Pradesh",
      "centroid": [
        23.5055,
        75.1039
      ],
      "bbox": [
        23.0904,
        74.5183,
        23.9207,
        75.6895
      ]
    },
    {
      "id": "madhya_pradesh_rewa",
      "name": "Rewa",
      "state": "Madhya Pradesh",
      "centroid": [
        24.7597,
        81.6687
      ],
      "bbox": [
        24.3238,
        81.0389,
        25.1957,
        82.2986
      ]
    },
    {
      "id": "madhya_pradesh_sagar",
      "name": "Sagar",
      "state": "Madhya Pradesh",
      "centroid": [
        23.8132,
        78.6994
      ],
      "bbox": [
        23.1725,
        78.0533,
        24.4539,
        79.3455
      ]
    },
    {
      "id": "madhya_pradesh_satna",
      "name": "Satna",
      "state": "Madhya Pradesh",
      "centroid": [
        24.5818,
        80.8654
      ],
      "bbox": [
        23.968,
        80.3478,
        25.1956,
        81.3829
      ]
    },
    {
      "id": "madhya_pradesh_sehore",
      "name": "Sehore",
      "state": "Madhya Pradesh",
      "centroid": [
        23.1264,
        77.2365
      ],
      "bbox": [
        22.5621,
        76.4438,
        23.6908,
        78.0293
      ]
    },
    {
      "id": "madhya_pradesh_seoni",
      "name": "Seoni",
      "state": "Madhya Pradesh",
      "centroid": [
        22.2738,
        79.7389
      ],
      "bbox": [
        21.5903,
        79.1937,
        22.9573,
        80.2841
      ]
    },
    {
      "id": "madhya_pradesh_shahdol",
      "name": "Shahdol",
      "state": "Madhya Pradesh",
      "centroid": [
        23.4655,
        81.4844
      ],
      "bbox": [
        22.6461,
        80.9936,
        24.2849,
        81.9751
      ]
    },
    {
      "id": "madhya_pradesh_shajapur",
      "name": "Shajapur",
      "state": "Madhya Pradesh",
      "centroid": [
        23.7203,
        76.3663
      ],
      "bbox": [
        23.1091,
        75.6845,
        24.3315,
        77.0481
      ]
    },
    {
      "id": "madhya_pradesh_sheopur",
      "name": "Sheopur",
      "state": "Madhya Pradesh",
      "centroid": [
        25.7503,
        77.0695
      ],
      "bbox": [
        25.2754,
        76.4778,
        26.2251,
        77.6613
      ]
    },
    {
      "id": "madhya_pradesh_shivpuri",
      "name": "Shivpuri",
      "state": "Madhya Pradesh",
      "centroid": [
        25.3808,
        77.7338
      ],
      "bbox": [
        24.8401,
        77.0066,
        25.9215,
        78.4609
      ]
    },
    {
      "id": "madhya_pradesh_sidhi",
      "name": "Sidhi",
      "state": "Madhya Pradesh",
      "centroid": [
        24.2452,
        82.053
      ],
      "bbox": [
        23.7842,
        81.2983,
        24.7063,
        82.8078
      ]
    },
    {
      "id": "madhya_pradesh_tikamgarh",
      "name": "Tikamgarh",
      "state": "Madhya Pradesh",
      "centroid": [
        25.002,
        78.8847
      ],
      "bbox": [
        24.4431,
        78.4274,
        25.5608,
        79.342
      ]
    },
    {
      "id": "madhya_pradesh_ujjain",
      "name": "Ujjain",
      "state": "Madhya Pradesh",
      "centroid": [
        23.298,
        75.6919
      ],
      "bbox": [
        22.834,
        75.1341,
        23.7621,
        76.2496
      ]
    },
    {
      "id": "madhya_pradesh_umaria",
      "name": "Umaria",
      "state": "Madhya Pradesh",
      "centroid": [
        23.6461,
        80.892
      ],
      "bbox": [
        23.196,
        80.5224,
        24.0961,
        81.2616
      ]
    },
    {
      "id": "madhya_pradesh_vidisha",
      "name": "Vidisha",
      "state": "Madhya Pradesh",
      "centroid": [
        23.851,
        77.7741
      ],
      "bbox": [
        23.3488,
        77.2555,
        24.3531,
        78.2928
      ]
    },
    {
      "id": "madhya_pradesh_west_nimar",
      "name": "West Nimar",
      "state": "Madhya Pradesh",
      "centroid": [
        21.9633,
        75.7236
      ],
      "bbox": [
        21.3761,
        75.2103,
        22.5506,
        76.237
      ]
    }
  ],
  "Maharashtra": [
    {
      "id": "maharashtra_ahmednagar",
      "name": "Ahmednagar",
      "state": "Maharashtra",
      "centroid": [
        19.1596,
        74.5874
      ],
      "bbox": [
        18.3305,
        73.6288,
        19.9886,
        75.546
      ]
    },
    {
      "id": "maharashtra_akola",
      "name": "Akola",
      "state": "Maharashtra",
      "centroid": [
        20.7636,
        77.1399
      ],
      "bbox": [
        20.2793,
        76.6623,
        21.248,
        77.6175
      ]
    },
    {
      "id": "maharashtra_amravati",
      "name": "Amravati",
      "state": "Maharashtra",
      "centroid": [
        21.1561,
        77.5356
      ],
      "bbox": [
        20.5408,
        76.6245,
        21.7714,
        78.4467
      ]
    },
    {
      "id": "maharashtra_aurangabad",
      "name": "Aurangabad",
      "state": "Maharashtra",
      "centroid": [
        20.0256,
        75.2456
      ],
      "bbox": [
        19.3789,
        74.5964,
        20.6722,
        75.8948
      ]
    },
    {
      "id": "maharashtra_bhandara",
      "name": "Bhandara",
      "state": "Maharashtra",
      "centroid": [
        21.1211,
        80.0585
      ],
      "bbox": [
        20.6397,
        79.4433,
        21.6025,
        80.6738
      ]
    },
    {
      "id": "maharashtra_bid",
      "name": "Bid",
      "state": "Maharashtra",
      "centroid": [
        18.9747,
        75.7764
      ],
      "bbox": [
        18.5087,
        74.8168,
        19.4406,
        76.7359
      ]
    },
    {
      "id": "maharashtra_buldana",
      "name": "Buldana",
      "state": "Maharashtra",
      "centroid": [
        20.565,
        76.3743
      ],
      "bbox": [
        19.8388,
        75.9206,
        21.2913,
        76.828
      ]
    },
    {
      "id": "maharashtra_chandrapur",
      "name": "Chandrapur",
      "state": "Maharashtra",
      "centroid": [
        20.0946,
        79.3927
      ],
      "bbox": [
        19.4587,
        78.796,
        20.7305,
        79.9893
      ]
    },
    {
      "id": "maharashtra_dhule",
      "name": "Dhule",
      "state": "Maharashtra",
      "centroid": [
        21.1337,
        74.5324
      ],
      "bbox": [
        20.6335,
        73.8572,
        21.634,
        75.2075
      ]
    },
    {
      "id": "maharashtra_garhchiroli",
      "name": "Garhchiroli",
      "state": "Maharashtra",
      "centroid": [
        19.7529,
        80.3148
      ],
      "bbox": [
        18.6756,
        79.7374,
        20.8303,
        80.8922
      ]
    },
    {
      "id": "maharashtra_gondiya",
      "name": "Gondiya",
      "state": "Maharashtra",
      "centroid": [
        21.1433,
        80.1737
      ],
      "bbox": [
        20.6518,
        79.7915,
        21.6349,
        80.5559
      ]
    },
    {
      "id": "maharashtra_greater_bombay",
      "name": "Greater Bombay",
      "state": "Maharashtra",
      "centroid": [
        19.103,
        72.9502
      ],
      "bbox": [
        18.8907,
        72.776,
        19.3154,
        73.1243
      ]
    },
    {
      "id": "maharashtra_hingoli",
      "name": "Hingoli",
      "state": "Maharashtra",
      "centroid": [
        19.5422,
        77.0829
      ],
      "bbox": [
        19.0659,
        76.6753,
        20.0185,
        77.4905
      ]
    },
    {
      "id": "maharashtra_jalgaon",
      "name": "Jalgaon",
      "state": "Maharashtra",
      "centroid": [
        20.8441,
        75.5814
      ],
      "bbox": [
        20.271,
        74.7656,
        21.4171,
        76.3971
      ]
    },
    {
      "id": "maharashtra_jalna",
      "name": "Jalna",
      "state": "Maharashtra",
      "centroid": [
        19.9626,
        76.0616
      ],
      "bbox": [
        19.2778,
        75.5906,
        20.6473,
        76.5326
      ]
    },
    {
      "id": "maharashtra_kolhapur",
      "name": "Kolhapur",
      "state": "Maharashtra",
      "centroid": [
        16.459,
        74.2025
      ],
      "bbox": [
        15.7393,
        73.699,
        17.1788,
        74.706
      ]
    },
    {
      "id": "maharashtra_latur",
      "name": "Latur",
      "state": "Maharashtra",
      "centroid": [
        18.3518,
        76.7491
      ],
      "bbox": [
        17.8683,
        76.2002,
        18.8354,
        77.298
      ]
    },
    {
      "id": "maharashtra_nagpur",
      "name": "Nagpur",
      "state": "Maharashtra",
      "centroid": [
        21.1521,
        78.9507
      ],
      "bbox": [
        20.5803,
        78.2467,
        21.7239,
        79.6547
      ]
    },
    {
      "id": "maharashtra_nanded",
      "name": "Nanded",
      "state": "Maharashtra",
      "centroid": [
        19.0955,
        77.6499
      ],
      "bbox": [
        18.26,
        76.932,
        19.931,
        78.3677
      ]
    },
    {
      "id": "maharashtra_nandurbar",
      "name": "Nandurbar",
      "state": "Maharashtra",
      "centroid": [
        21.512,
        74.1818
      ],
      "bbox": [
        20.9931,
        73.5875,
        22.031,
        74.7761
      ]
    },
    {
      "id": "maharashtra_nashik",
      "name": "Nashik",
      "state": "Maharashtra",
      "centroid": [
        20.2263,
        74.1003
      ],
      "bbox": [
        19.5864,
        73.2594,
        20.8662,
        74.9412
      ]
    },
    {
      "id": "maharashtra_osmanabad",
      "name": "Osmanabad",
      "state": "Maharashtra",
      "centroid": [
        18.1694,
        76.0382
      ],
      "bbox": [
        17.6419,
        75.2881,
        18.697,
        76.7882
      ]
    },
    {
      "id": "maharashtra_parbhani",
      "name": "Parbhani",
      "state": "Maharashtra",
      "centroid": [
        19.3081,
        76.6637
      ],
      "bbox": [
        18.7487,
        76.2092,
        19.8675,
        77.1182
      ]
    },
    {
      "id": "maharashtra_pune",
      "name": "Pune",
      "state": "Maharashtra",
      "centroid": [
        18.6432,
        74.25
      ],
      "bbox": [
        17.8914,
        73.3328,
        19.395,
        75.1671
      ]
    },
    {
      "id": "maharashtra_raigarh",
      "name": "Raigarh",
      "state": "Maharashtra",
      "centroid": [
        18.4919,
        73.2441
      ],
      "bbox": [
        17.8493,
        72.8118,
        19.1346,
        73.6763
      ]
    },
    {
      "id": "maharashtra_ratnagiri",
      "name": "Ratnagiri",
      "state": "Maharashtra",
      "centroid": [
        17.2803,
        73.4516
      ],
      "bbox": [
        16.4916,
        73.0285,
        18.0691,
        73.8747
      ]
    },
    {
      "id": "maharashtra_sangli",
      "name": "Sangli",
      "state": "Maharashtra",
      "centroid": [
        17.1705,
        74.6919
      ],
      "bbox": [
        16.7131,
        73.7027,
        17.6279,
        75.6811
      ]
    },
    {
      "id": "maharashtra_satara",
      "name": "Satara",
      "state": "Maharashtra",
      "centroid": [
        17.6363,
        74.2272
      ],
      "bbox": [
        17.0898,
        73.5448,
        18.1827,
        74.9097
      ]
    },
    {
      "id": "maharashtra_sindhudurg",
      "name": "Sindhudurg",
      "state": "Maharashtra",
      "centroid": [
        16.1329,
        73.7638
      ],
      "bbox": [
        15.6046,
        73.3101,
        16.6611,
        74.2174
      ]
    },
    {
      "id": "maharashtra_solapur",
      "name": "Solapur",
      "state": "Maharashtra",
      "centroid": [
        17.8334,
        75.5214
      ],
      "bbox": [
        17.1126,
        74.614,
        18.5543,
        76.4287
      ]
    },
    {
      "id": "maharashtra_thane",
      "name": "Thane",
      "state": "Maharashtra",
      "centroid": [
        19.645,
        73.2284
      ],
      "bbox": [
        19.0633,
        72.6507,
        20.2266,
        73.8061
      ]
    },
    {
      "id": "maharashtra_wardha",
      "name": "Wardha",
      "state": "Maharashtra",
      "centroid": [
        20.8254,
        78.6351
      ],
      "bbox": [
        20.2924,
        78.0513,
        21.3583,
        79.219
      ]
    },
    {
      "id": "maharashtra_washim",
      "name": "Washim",
      "state": "Maharashtra",
      "centroid": [
        20.304,
        77.1465
      ],
      "bbox": [
        19.8468,
        76.6055,
        20.7611,
        77.6875
      ]
    },
    {
      "id": "maharashtra_yavatmal",
      "name": "Yavatmal",
      "state": "Maharashtra",
      "centroid": [
        20.064,
        78.2142
      ],
      "bbox": [
        19.4305,
        77.2826,
        20.6975,
        79.1459
      ]
    }
  ],
  "Manipur": [
    {
      "id": "manipur_bishnupur",
      "name": "Bishnupur",
      "state": "Manipur",
      "centroid": [
        24.5164,
        93.8019
      ],
      "bbox": [
        24.2907,
        93.7096,
        24.742,
        93.8941
      ]
    },
    {
      "id": "manipur_chandel",
      "name": "Chandel",
      "state": "Manipur",
      "centroid": [
        24.2418,
        94.0759
      ],
      "bbox": [
        23.8427,
        93.7403,
        24.641,
        94.4115
      ]
    },
    {
      "id": "manipur_churachandpur",
      "name": "Churachandpur",
      "state": "Manipur",
      "centroid": [
        24.3297,
        93.428
      ],
      "bbox": [
        23.9472,
        92.9736,
        24.7122,
        93.8824
      ]
    },
    {
      "id": "manipur_east_imphal",
      "name": "East Imphal",
      "state": "Manipur",
      "centroid": [
        24.8096,
        93.611
      ],
      "bbox": [
        24.5641,
        93.0754,
        25.055,
        94.1466
      ]
    },
    {
      "id": "manipur_senapati",
      "name": "Senapati",
      "state": "Manipur",
      "centroid": [
        25.1089,
        94.0803
      ],
      "bbox": [
        24.5962,
        93.6663,
        25.6216,
        94.4942
      ]
    },
    {
      "id": "manipur_tamenglong",
      "name": "Tamenglong",
      "state": "Manipur",
      "centroid": [
        24.9815,
        93.5526
      ],
      "bbox": [
        24.4975,
        93.1457,
        25.4656,
        93.9595
      ]
    },
    {
      "id": "manipur_thoubal",
      "name": "Thoubal",
      "state": "Manipur",
      "centroid": [
        24.487,
        93.9982
      ],
      "bbox": [
        24.2411,
        93.8425,
        24.7328,
        94.154
      ]
    },
    {
      "id": "manipur_ukhrul",
      "name": "Ukhrul",
      "state": "Manipur",
      "centroid": [
        25.0937,
        94.4366
      ],
      "bbox": [
        24.4896,
        94.1222,
        25.6977,
        94.751
      ]
    },
    {
      "id": "manipur_west_imphal",
      "name": "West Imphal",
      "state": "Manipur",
      "centroid": [
        24.8186,
        93.8821
      ],
      "bbox": [
        24.5571,
        93.7752,
        25.0801,
        93.9891
      ]
    }
  ],
  "Meghalaya": [
    {
      "id": "meghalaya_east_garo_hills",
      "name": "East Garo Hills",
      "state": "Meghalaya",
      "centroid": [
        25.7152,
        90.5701
      ],
      "bbox": [
        25.4151,
        90.1109,
        26.0153,
        91.0292
      ]
    },
    {
      "id": "meghalaya_east_khasi_hills",
      "name": "East Khasi Hills",
      "state": "Meghalaya",
      "centroid": [
        25.4046,
        91.7559
      ],
      "bbox": [
        25.1227,
        91.3548,
        25.6864,
        92.157
      ]
    },
    {
      "id": "meghalaya_jaintia_hills",
      "name": "Jaintia Hills",
      "state": "Meghalaya",
      "centroid": [
        25.3927,
        92.3941
      ],
      "bbox": [
        25.0318,
        91.9838,
        25.7536,
        92.8044
      ]
    },
    {
      "id": "meghalaya_ri-bhoi",
      "name": "Ri-Bhoi",
      "state": "Meghalaya",
      "centroid": [
        25.88,
        91.8218
      ],
      "bbox": [
        25.6412,
        91.3421,
        26.1187,
        92.3016
      ]
    },
    {
      "id": "meghalaya_south_garo_hills",
      "name": "South Garo Hills",
      "state": "Meghalaya",
      "centroid": [
        25.3493,
        90.6187
      ],
      "bbox": [
        25.1444,
        90.2653,
        25.5542,
        90.972
      ]
    },
    {
      "id": "meghalaya_west_garo_hills",
      "name": "West Garo Hills",
      "state": "Meghalaya",
      "centroid": [
        25.577,
        90.1313
      ],
      "bbox": [
        25.1998,
        89.8217,
        25.9541,
        90.441
      ]
    },
    {
      "id": "meghalaya_west_khasi_hills",
      "name": "West Khasi Hills",
      "state": "Meghalaya",
      "centroid": [
        25.5125,
        91.2894
      ],
      "bbox": [
        25.1659,
        90.7492,
        25.859,
        91.8296
      ]
    }
  ],
  "Mizoram": [
    {
      "id": "mizoram_aizawl",
      "name": "Aizawl",
      "state": "Mizoram",
      "centroid": [
        23.8623,
        92.9175
      ],
      "bbox": [
        23.3117,
        92.6238,
        24.4129,
        93.2111
      ]
    },
    {
      "id": "mizoram_champhai",
      "name": "Champhai",
      "state": "Mizoram",
      "centroid": [
        23.5456,
        93.2258
      ],
      "bbox": [
        23.0046,
        93.0068,
        24.0866,
        93.4447
      ]
    },
    {
      "id": "mizoram_kolasib",
      "name": "Kolasib",
      "state": "Mizoram",
      "centroid": [
        24.2385,
        92.7166
      ],
      "bbox": [
        23.9561,
        92.5298,
        24.5208,
        92.9035
      ]
    },
    {
      "id": "mizoram_lawngtlai",
      "name": "Lawngtlai",
      "state": "Mizoram",
      "centroid": [
        22.3695,
        92.7368
      ],
      "bbox": [
        21.9768,
        92.5043,
        22.7622,
        92.9692
      ]
    },
    {
      "id": "mizoram_lunglei",
      "name": "Lunglei",
      "state": "Mizoram",
      "centroid": [
        22.9531,
        92.7647
      ],
      "bbox": [
        22.4995,
        92.3611,
        23.4066,
        93.1684
      ]
    },
    {
      "id": "mizoram_mamit",
      "name": "Mamit",
      "state": "Mizoram",
      "centroid": [
        23.7558,
        92.4681
      ],
      "bbox": [
        23.2583,
        92.2594,
        24.2534,
        92.6767
      ]
    },
    {
      "id": "mizoram_saiha",
      "name": "Saiha",
      "state": "Mizoram",
      "centroid": [
        22.3784,
        93.0181
      ],
      "bbox": [
        21.9462,
        92.827,
        22.8106,
        93.2093
      ]
    },
    {
      "id": "mizoram_serchhip",
      "name": "Serchhip",
      "state": "Mizoram",
      "centroid": [
        23.3123,
        92.9375
      ],
      "bbox": [
        23.0065,
        92.6881,
        23.6181,
        93.1869
      ]
    }
  ],
  "Nagaland": [
    {
      "id": "nagaland_dimapur",
      "name": "Dimapur",
      "state": "Nagaland",
      "centroid": [
        25.8052,
        93.7721
      ],
      "bbox": [
        25.6443,
        93.5315,
        25.966,
        94.0128
      ]
    },
    {
      "id": "nagaland_kohima",
      "name": "Kohima",
      "state": "Nagaland",
      "centroid": [
        25.6157,
        93.8104
      ],
      "bbox": [
        25.2021,
        93.3317,
        26.0294,
        94.2891
      ]
    },
    {
      "id": "nagaland_mokokchung",
      "name": "Mokokchung",
      "state": "Nagaland",
      "centroid": [
        26.4831,
        94.5262
      ],
      "bbox": [
        26.1974,
        94.2925,
        26.7689,
        94.7598
      ]
    },
    {
      "id": "nagaland_mon",
      "name": "Mon",
      "state": "Nagaland",
      "centroid": [
        26.666,
        95.0139
      ],
      "bbox": [
        26.289,
        94.783,
        27.0429,
        95.2449
      ]
    },
    {
      "id": "nagaland_phek",
      "name": "Phek",
      "state": "Nagaland",
      "centroid": [
        25.6513,
        94.5476
      ],
      "bbox": [
        25.4554,
        94.1901,
        25.8471,
        94.905
      ]
    },
    {
      "id": "nagaland_tuensang",
      "name": "Tuensang",
      "state": "Nagaland",
      "centroid": [
        26.1973,
        94.8755
      ],
      "bbox": [
        25.5931,
        94.5652,
        26.8015,
        95.1857
      ]
    },
    {
      "id": "nagaland_wokha",
      "name": "Wokha",
      "state": "Nagaland",
      "centroid": [
        26.2447,
        94.173
      ],
      "bbox": [
        25.9254,
        93.9549,
        26.5641,
        94.3912
      ]
    },
    {
      "id": "nagaland_zunheboto",
      "name": "Zunheboto",
      "state": "Nagaland",
      "centroid": [
        26.0293,
        94.4666
      ],
      "bbox": [
        25.7634,
        94.2165,
        26.2952,
        94.7167
      ]
    }
  ],
  "Odisha": [
    {
      "id": "odisha_angul",
      "name": "Angul",
      "state": "Odisha",
      "centroid": [
        21.0974,
        84.8243
      ],
      "bbox": [
        20.5221,
        84.2597,
        21.6728,
        85.3889
      ]
    },
    {
      "id": "odisha_baleshwar",
      "name": "Baleshwar",
      "state": "Odisha",
      "centroid": [
        21.5142,
        86.9175
      ],
      "bbox": [
        21.0549,
        86.3522,
        21.9734,
        87.4827
      ]
    },
    {
      "id": "odisha_baragarh",
      "name": "Baragarh",
      "state": "Odisha",
      "centroid": [
        21.2309,
        83.2695
      ],
      "bbox": [
        20.7216,
        82.6318,
        21.7402,
        83.9072
      ]
    },
    {
      "id": "odisha_bhadrak",
      "name": "Bhadrak",
      "state": "Odisha",
      "centroid": [
        20.9779,
        86.6442
      ],
      "bbox": [
        20.723,
        86.2684,
        21.2329,
        87.02
      ]
    },
    {
      "id": "odisha_bolangir",
      "name": "Bolangir",
      "state": "Odisha",
      "centroid": [
        20.6042,
        83.1749
      ],
      "bbox": [
        20.1427,
        82.6793,
        21.0657,
        83.6706
      ]
    },
    {
      "id": "odisha_boudh",
      "name": "Boudh",
      "state": "Odisha",
      "centroid": [
        20.639,
        84.1773
      ],
      "bbox": [
        20.3805,
        83.565,
        20.8975,
        84.7897
      ]
    },
    {
      "id": "odisha_cuttack",
      "name": "Cuttack",
      "state": "Odisha",
      "centroid": [
        20.3623,
        85.5617
      ],
      "bbox": [
        20.0316,
        84.845,
        20.693,
        86.2785
      ]
    },
    {
      "id": "odisha_deogarh",
      "name": "Deogarh",
      "state": "Odisha",
      "centroid": [
        21.4335,
        84.8411
      ],
      "bbox": [
        21.1286,
        84.4728,
        21.7384,
        85.2094
      ]
    },
    {
      "id": "odisha_dhenkanal",
      "name": "Dhenkanal",
      "state": "Odisha",
      "centroid": [
        20.8293,
        85.5684
      ],
      "bbox": [
        20.4786,
        85.1087,
        21.1799,
        86.0282
      ]
    },
    {
      "id": "odisha_gajapati",
      "name": "Gajapati",
      "state": "Odisha",
      "centroid": [
        19.1863,
        84.1145
      ],
      "bbox": [
        18.7446,
        83.7883,
        19.6279,
        84.4406
      ]
    },
    {
      "id": "odisha_ganjam",
      "name": "Ganjam",
      "state": "Odisha",
      "centroid": [
        19.6249,
        84.6518
      ],
      "bbox": [
        18.975,
        84.1257,
        20.2749,
        85.1779
      ]
    },
    {
      "id": "odisha_jagatsinghpur",
      "name": "Jagatsinghpur",
      "state": "Odisha",
      "centroid": [
        20.1764,
        86.3642
      ],
      "bbox": [
        19.9586,
        86.0095,
        20.3942,
        86.7189
      ]
    },
    {
      "id": "odisha_jajpur",
      "name": "Jajpur",
      "state": "Odisha",
      "centroid": [
        20.8673,
        86.15
      ],
      "bbox": [
        20.572,
        85.6792,
        21.1626,
        86.6208
      ]
    },
    {
      "id": "odisha_jharsuguda",
      "name": "Jharsuguda",
      "state": "Odisha",
      "centroid": [
        21.7985,
        83.9031
      ],
      "bbox": [
        21.563,
        83.4197,
        22.0341,
        84.3865
      ]
    },
    {
      "id": "odisha_kalahandi",
      "name": "Kalahandi",
      "state": "Odisha",
      "centroid": [
        19.813,
        83.1522
      ],
      "bbox": [
        19.1771,
        82.5198,
        20.4489,
        83.7846
      ]
    },
    {
      "id": "odisha_kandhamal",
      "name": "Kandhamal",
      "state": "Odisha",
      "centroid": [
        20.1266,
        84.0345
      ],
      "bbox": [
        19.5641,
        83.4887,
        20.689,
        84.5803
      ]
    },
    {
      "id": "odisha_kendrapara",
      "name": "Kendrapara",
      "state": "Odisha",
      "centroid": [
        20.5427,
        86.6702
      ],
      "bbox": [
        20.2929,
        86.2459,
        20.7926,
        87.0944
      ]
    },
    {
      "id": "odisha_keonjhar",
      "name": "Keonjhar",
      "state": "Odisha",
      "centroid": [
        21.5833,
        85.7754
      ],
      "bbox": [
        21.0081,
        85.1807,
        22.1586,
        86.37
      ]
    },
    {
      "id": "odisha_khordha",
      "name": "Khordha",
      "state": "Odisha",
      "centroid": [
        20.0472,
        85.5033
      ],
      "bbox": [
        19.6674,
        84.9296,
        20.427,
        86.077
      ]
    },
    {
      "id": "odisha_koraput",
      "name": "Koraput",
      "state": "Odisha",
      "centroid": [
        18.731,
        82.7464
      ],
      "bbox": [
        18.2285,
        82.0814,
        19.2335,
        83.4113
      ]
    },
    {
      "id": "odisha_malkangiri",
      "name": "Malkangiri",
      "state": "Odisha",
      "centroid": [
        18.2677,
        81.9119
      ],
      "bbox": [
        17.8026,
        81.383,
        18.7327,
        82.4409
      ]
    },
    {
      "id": "odisha_mayurbhanj",
      "name": "Mayurbhanj",
      "state": "Odisha",
      "centroid": [
        21.9118,
        86.4189
      ],
      "bbox": [
        21.26,
        85.658,
        22.5636,
        87.1798
      ]
    },
    {
      "id": "odisha_nabarangpur",
      "name": "Nabarangpur",
      "state": "Odisha",
      "centroid": [
        19.6216,
        82.3431
      ],
      "bbox": [
        19.141,
        81.8373,
        20.1023,
        82.8488
      ]
    },
    {
      "id": "odisha_nayagarh",
      "name": "Nayagarh",
      "state": "Odisha",
      "centroid": [
        20.2324,
        84.9648
      ],
      "bbox": [
        19.8896,
        84.4786,
        20.5752,
        85.451
      ]
    },
    {
      "id": "odisha_nuapada",
      "name": "Nuapada",
      "state": "Odisha",
      "centroid": [
        20.5363,
        82.5897
      ],
      "bbox": [
        19.9856,
        82.324,
        21.087,
        82.8553
      ]
    },
    {
      "id": "odisha_puri",
      "name": "Puri",
      "state": "Odisha",
      "centroid": [
        19.8251,
        85.7296
      ],
      "bbox": [
        19.4617,
        85.0865,
        20.1884,
        86.3727
      ]
    },
    {
      "id": "odisha_rayagada",
      "name": "Rayagada",
      "state": "Odisha",
      "centroid": [
        19.4339,
        83.4479
      ],
      "bbox": [
        18.9013,
        82.871,
        19.9665,
        84.0248
      ]
    },
    {
      "id": "odisha_sambalpur",
      "name": "Sambalpur",
      "state": "Odisha",
      "centroid": [
        21.5523,
        84.2796
      ],
      "bbox": [
        20.9189,
        83.7931,
        22.1857,
        84.766
      ]
    },
    {
      "id": "odisha_sonepur",
      "name": "Sonepur",
      "state": "Odisha",
      "centroid": [
        20.8485,
        83.8595
      ],
      "bbox": [
        20.5231,
        83.443,
        21.174,
        84.276
      ]
    },
    {
      "id": "odisha_sundargarh",
      "name": "Sundargarh",
      "state": "Odisha",
      "centroid": [
        22.0567,
        84.4518
      ],
      "bbox": [
        21.5846,
        83.5324,
        22.5288,
        85.3711
      ]
    }
  ],
  "Puducherry": [
    {
      "id": "puducherry_karaikal",
      "name": "Karaikal",
      "state": "Puducherry",
      "centroid": [
        10.9001,
        79.7788
      ],
      "bbox": [
        10.8111,
        79.7029,
        10.9891,
        79.8546
      ]
    },
    {
      "id": "puducherry_mahe",
      "name": "Mahe",
      "state": "Puducherry",
      "centroid": [
        12.0485,
        75.3118
      ],
      "bbox": [
        11.9479,
        75.2211,
        12.1491,
        75.4025
      ]
    },
    {
      "id": "puducherry_puducherry",
      "name": "Puducherry",
      "state": "Puducherry",
      "centroid": [
        11.9139,
        79.7399
      ],
      "bbox": [
        11.8084,
        79.6423,
        12.0193,
        79.8376
      ]
    },
    {
      "id": "puducherry_yanam",
      "name": "Yanam",
      "state": "Puducherry",
      "centroid": [
        16.7207,
        82.2387
      ],
      "bbox": [
        16.6897,
        82.1746,
        16.7517,
        82.3028
      ]
    }
  ],
  "Punjab": [
    {
      "id": "punjab_amritsar",
      "name": "Amritsar",
      "state": "Punjab",
      "centroid": [
        31.5681,
        74.9462
      ],
      "bbox": [
        31.0843,
        74.5013,
        32.0519,
        75.3911
      ]
    },
    {
      "id": "punjab_bathinda",
      "name": "Bathinda",
      "state": "Punjab",
      "centroid": [
        30.1795,
        74.9945
      ],
      "bbox": [
        29.777,
        74.6219,
        30.5821,
        75.3671
      ]
    },
    {
      "id": "punjab_faridkot",
      "name": "Faridkot",
      "state": "Punjab",
      "centroid": [
        30.599,
        74.7519
      ],
      "bbox": [
        30.3674,
        74.4588,
        30.8306,
        75.045
      ]
    },
    {
      "id": "punjab_fatehgarh_sahib",
      "name": "Fatehgarh Sahib",
      "state": "Punjab",
      "centroid": [
        30.6649,
        76.3229
      ],
      "bbox": [
        30.4146,
        76.0646,
        30.9153,
        76.5812
      ]
    },
    {
      "id": "punjab_firozpur",
      "name": "Firozpur",
      "state": "Punjab",
      "centroid": [
        30.5545,
        74.4936
      ],
      "bbox": [
        29.9471,
        73.8709,
        31.162,
        75.1163
      ]
    },
    {
      "id": "punjab_gurdaspur",
      "name": "Gurdaspur",
      "state": "Punjab",
      "centroid": [
        32.0855,
        75.4046
      ],
      "bbox": [
        31.5949,
        74.8745,
        32.5762,
        75.9346
      ]
    },
    {
      "id": "punjab_hoshiarpur",
      "name": "Hoshiarpur",
      "state": "Punjab",
      "centroid": [
        31.6087,
        75.8995
      ],
      "bbox": [
        31.1357,
        75.461,
        32.0817,
        76.3379
      ]
    },
    {
      "id": "punjab_jalandhar",
      "name": "Jalandhar",
      "state": "Punjab",
      "centroid": [
        31.2942,
        75.5023
      ],
      "bbox": [
        30.9706,
        75.0604,
        31.6179,
        75.9441
      ]
    },
    {
      "id": "punjab_kapurthala",
      "name": "Kapurthala",
      "state": "Punjab",
      "centroid": [
        31.386,
        75.4169
      ],
      "bbox": [
        31.12,
        74.9367,
        31.652,
        75.8972
      ]
    },
    {
      "id": "punjab_ludhiana",
      "name": "Ludhiana",
      "state": "Punjab",
      "centroid": [
        30.7921,
        75.8401
      ],
      "bbox": [
        30.5629,
        75.3429,
        31.0214,
        76.3373
      ]
    },
    {
      "id": "punjab_mansa",
      "name": "Mansa",
      "state": "Punjab",
      "centroid": [
        29.8791,
        75.4618
      ],
      "bbox": [
        29.5462,
        75.1578,
        30.212,
        75.7658
      ]
    },
    {
      "id": "punjab_moga",
      "name": "Moga",
      "state": "Punjab",
      "centroid": [
        30.7932,
        75.151
      ],
      "bbox": [
        30.4889,
        74.8923,
        31.0975,
        75.4097
      ]
    },
    {
      "id": "punjab_muktsar",
      "name": "Muktsar",
      "state": "Punjab",
      "centroid": [
        30.2856,
        74.5264
      ],
      "bbox": [
        29.9039,
        74.2414,
        30.6673,
        74.8113
      ]
    },
    {
      "id": "punjab_nawan_shehar",
      "name": "Nawan Shehar",
      "state": "Punjab",
      "centroid": [
        31.1296,
        76.1392
      ],
      "bbox": [
        30.9736,
        75.7717,
        31.2855,
        76.5066
      ]
    },
    {
      "id": "punjab_patiala",
      "name": "Patiala",
      "state": "Punjab",
      "centroid": [
        30.2411,
        76.4515
      ],
      "bbox": [
        29.7964,
        75.9716,
        30.6858,
        76.9314
      ]
    },
    {
      "id": "punjab_rupnagar",
      "name": "Rupnagar",
      "state": "Punjab",
      "centroid": [
        31.0072,
        76.5621
      ],
      "bbox": [
        30.5729,
        76.2774,
        31.4414,
        76.8468
      ]
    },
    {
      "id": "punjab_sangrur",
      "name": "Sangrur",
      "state": "Punjab",
      "centroid": [
        30.2108,
        75.7189
      ],
      "bbox": [
        29.7314,
        75.2463,
        30.6902,
        76.1915
      ]
    }
  ],
  "Rajasthan": [
    {
      "id": "rajasthan_ajmer",
      "name": "Ajmer",
      "state": "Rajasthan",
      "centroid": [
        26.3162,
        74.6286
      ],
      "bbox": [
        25.6523,
        73.9056,
        26.9801,
        75.3516
      ]
    },
    {
      "id": "rajasthan_alwar",
      "name": "Alwar",
      "state": "Rajasthan",
      "centroid": [
        27.6438,
        76.6598
      ],
      "bbox": [
        27.0608,
        76.1179,
        28.2267,
        77.2016
      ]
    },
    {
      "id": "rajasthan_banswara",
      "name": "Banswara",
      "state": "Rajasthan",
      "centroid": [
        23.4948,
        74.3758
      ],
      "bbox": [
        23.0627,
        73.9625,
        23.927,
        74.7892
      ]
    },
    {
      "id": "rajasthan_baran",
      "name": "Baran",
      "state": "Rajasthan",
      "centroid": [
        24.923,
        76.816
      ],
      "bbox": [
        24.4093,
        76.214,
        25.4367,
        77.418
      ]
    },
    {
      "id": "rajasthan_barmer",
      "name": "Barmer",
      "state": "Rajasthan",
      "centroid": [
        25.5754,
        71.4723
      ],
      "bbox": [
        24.6429,
        70.0945,
        26.5078,
        72.8501
      ]
    },
    {
      "id": "rajasthan_bharatpur",
      "name": "Bharatpur",
      "state": "Rajasthan",
      "centroid": [
        27.2672,
        77.3141
      ],
      "bbox": [
        26.7125,
        76.8732,
        27.8219,
        77.755
      ]
    },
    {
      "id": "rajasthan_bhilwara",
      "name": "Bhilwara",
      "state": "Rajasthan",
      "centroid": [
        25.4915,
        74.7365
      ],
      "bbox": [
        25.0182,
        74.0122,
        25.9647,
        75.4608
      ]
    },
    {
      "id": "rajasthan_bikaner",
      "name": "Bikaner",
      "state": "Rajasthan",
      "centroid": [
        28.1186,
        73.0419
      ],
      "bbox": [
        27.1862,
        71.8963,
        29.051,
        74.1876
      ]
    },
    {
      "id": "rajasthan_bundi",
      "name": "Bundi",
      "state": "Rajasthan",
      "centroid": [
        25.4433,
        75.7912
      ],
      "bbox": [
        25.0003,
        75.2619,
        25.8864,
        76.3205
      ]
    },
    {
      "id": "rajasthan_chittaurgarh",
      "name": "Chittaurgarh",
      "state": "Rajasthan",
      "centroid": [
        24.3772,
        74.9629
      ],
      "bbox": [
        23.5341,
        74.1071,
        25.2203,
        75.8187
      ]
    },
    {
      "id": "rajasthan_churu",
      "name": "Churu",
      "state": "Rajasthan",
      "centroid": [
        28.2068,
        74.6493
      ],
      "bbox": [
        27.412,
        73.6332,
        29.0016,
        75.6655
      ]
    },
    {
      "id": "rajasthan_dausa",
      "name": "Dausa",
      "state": "Rajasthan",
      "centroid": [
        26.81,
        76.6117
      ],
      "bbox": [
        26.3817,
        76.1526,
        27.2383,
        77.0708
      ]
    },
    {
      "id": "rajasthan_dhaulpur",
      "name": "Dhaulpur",
      "state": "Rajasthan",
      "centroid": [
        26.6598,
        77.7412
      ],
      "bbox": [
        26.3624,
        77.2201,
        26.9571,
        78.2622
      ]
    },
    {
      "id": "rajasthan_dungarpur",
      "name": "Dungarpur",
      "state": "Rajasthan",
      "centroid": [
        23.6786,
        73.8731
      ],
      "bbox": [
        23.3359,
        73.3611,
        24.0214,
        74.3852
      ]
    },
    {
      "id": "rajasthan_ganganagar",
      "name": "Ganganagar",
      "state": "Rajasthan",
      "centroid": [
        29.4531,
        73.4819
      ],
      "bbox": [
        28.7112,
        72.6435,
        30.195,
        74.3202
      ]
    },
    {
      "id": "rajasthan_hanumangarh",
      "name": "Hanumangarh",
      "state": "Rajasthan",
      "centroid": [
        29.367,
        74.7398
      ],
      "bbox": [
        28.7777,
        73.9631,
        29.9563,
        75.5165
      ]
    },
    {
      "id": "rajasthan_jaipur",
      "name": "Jaipur",
      "state": "Rajasthan",
      "centroid": [
        27.156,
        75.5995
      ],
      "bbox": [
        26.4435,
        74.9123,
        27.8684,
        76.2866
      ]
    },
    {
      "id": "rajasthan_jaisalmer",
      "name": "Jaisalmer",
      "state": "Rajasthan",
      "centroid": [
        26.9479,
        70.9126
      ],
      "bbox": [
        25.8603,
        69.4837,
        28.0355,
        72.3416
      ]
    },
    {
      "id": "rajasthan_jalor",
      "name": "Jalor",
      "state": "Rajasthan",
      "centroid": [
        25.2059,
        72.1478
      ],
      "bbox": [
        24.6042,
        71.1971,
        25.8076,
        73.0985
      ]
    },
    {
      "id": "rajasthan_jhalawar",
      "name": "Jhalawar",
      "state": "Rajasthan",
      "centroid": [
        24.3186,
        76.2004
      ],
      "bbox": [
        23.7606,
        75.4559,
        24.8767,
        76.9448
      ]
    },
    {
      "id": "rajasthan_jhunjhunun",
      "name": "Jhunjhunun",
      "state": "Rajasthan",
      "centroid": [
        28.0838,
        75.5567
      ],
      "bbox": [
        27.6467,
        75.0205,
        28.5209,
        76.0929
      ]
    },
    {
      "id": "rajasthan_jodhpur",
      "name": "Jodhpur",
      "state": "Rajasthan",
      "centroid": [
        26.7336,
        72.8303
      ],
      "bbox": [
        25.8518,
        71.7894,
        27.6154,
        73.8712
      ]
    },
    {
      "id": "rajasthan_karauli",
      "name": "Karauli",
      "state": "Rajasthan",
      "centroid": [
        26.5014,
        76.9163
      ],
      "bbox": [
        26.0364,
        76.4463,
        26.9663,
        77.3864
      ]
    },
    {
      "id": "rajasthan_kota",
      "name": "Kota",
      "state": "Rajasthan",
      "centroid": [
        25.1958,
        76.0995
      ],
      "bbox": [
        24.5438,
        75.6207,
        25.8478,
        76.5783
      ]
    },
    {
      "id": "rajasthan_nagaur",
      "name": "Nagaur",
      "state": "Rajasthan",
      "centroid": [
        27.0594,
        74.238
      ],
      "bbox": [
        26.4106,
        73.1126,
        27.7082,
        75.3634
      ]
    },
    {
      "id": "rajasthan_pali",
      "name": "Pali",
      "state": "Rajasthan",
      "centroid": [
        25.6103,
        73.5894
      ],
      "bbox": [
        24.7573,
        72.7795,
        26.4633,
        74.3993
      ]
    },
    {
      "id": "rajasthan_rajsamand",
      "name": "Rajsamand",
      "state": "Rajasthan",
      "centroid": [
        25.2682,
        73.8982
      ],
      "bbox": [
        24.6683,
        73.4747,
        25.8681,
        74.3218
      ]
    },
    {
      "id": "rajasthan_sawai_madhopur",
      "name": "Sawai Madhopur",
      "state": "Rajasthan",
      "centroid": [
        26.2003,
        76.4709
      ],
      "bbox": [
        25.7432,
        75.9765,
        26.6574,
        76.9653
      ]
    },
    {
      "id": "rajasthan_sikar",
      "name": "Sikar",
      "state": "Rajasthan",
      "centroid": [
        27.6652,
        75.3826
      ],
      "bbox": [
        27.1267,
        74.6755,
        28.2037,
        76.0898
      ]
    },
    {
      "id": "rajasthan_sirohi",
      "name": "Sirohi",
      "state": "Rajasthan",
      "centroid": [
        24.8064,
        72.7087
      ],
      "bbox": [
        24.3263,
        72.251,
        25.2864,
        73.1664
      ]
    },
    {
      "id": "rajasthan_tonk",
      "name": "Tonk",
      "state": "Rajasthan",
      "centroid": [
        26.1244,
        75.7159
      ],
      "bbox": [
        25.6811,
        75.1095,
        26.5677,
        76.3224
      ]
    },
    {
      "id": "rajasthan_udaipur",
      "name": "Udaipur",
      "state": "Rajasthan",
      "centroid": [
        24.4577,
        73.7961
      ],
      "bbox": [
        23.8069,
        73.0096,
        25.1084,
        74.5826
      ]
    }
  ],
  "Sikkim": [
    {
      "id": "sikkim_east",
      "name": "East",
      "state": "Sikkim",
      "centroid": [
        27.2801,
        88.6796
      ],
      "bbox": [
        27.1374,
        88.4367,
        27.4229,
        88.9224
      ]
    },
    {
      "id": "sikkim_north_sikkim",
      "name": "North Sikkim",
      "state": "Sikkim",
      "centroid": [
        27.7547,
        88.4997
      ],
      "bbox": [
        27.3784,
        88.1136,
        28.131,
        88.8857
      ]
    },
    {
      "id": "sikkim_south_sikkim",
      "name": "South Sikkim",
      "state": "Sikkim",
      "centroid": [
        27.3049,
        88.3964
      ],
      "bbox": [
        27.0816,
        88.2608,
        27.5282,
        88.532
      ]
    },
    {
      "id": "sikkim_west_sikkim",
      "name": "West Sikkim",
      "state": "Sikkim",
      "centroid": [
        27.3629,
        88.1851
      ],
      "bbox": [
        27.1117,
        88.017,
        27.614,
        88.3532
      ]
    }
  ],
  "Tamil Nadu": [
    {
      "id": "tamil_nadu_ariyalur",
      "name": "Ariyalur",
      "state": "Tamil Nadu",
      "centroid": [
        11.1377,
        79.2103
      ],
      "bbox": [
        10.8695,
        78.9229,
        11.4058,
        79.4976
      ]
    },
    {
      "id": "tamil_nadu_chennai",
      "name": "Chennai",
      "state": "Tamil Nadu",
      "centroid": [
        13.0428,
        80.2378
      ],
      "bbox": [
        12.9518,
        80.1696,
        13.1338,
        80.306
      ]
    },
    {
      "id": "tamil_nadu_coimbatore",
      "name": "Coimbatore",
      "state": "Tamil Nadu",
      "centroid": [
        10.8027,
        77.0688
      ],
      "bbox": [
        10.2087,
        76.6474,
        11.3968,
        77.4903
      ]
    },
    {
      "id": "tamil_nadu_cuddalore",
      "name": "Cuddalore",
      "state": "Tamil Nadu",
      "centroid": [
        11.5044,
        79.3375
      ],
      "bbox": [
        11.1347,
        78.861,
        11.8741,
        79.814
      ]
    },
    {
      "id": "tamil_nadu_dharmapuri",
      "name": "Dharmapuri",
      "state": "Tamil Nadu",
      "centroid": [
        12.3196,
        78.0985
      ],
      "bbox": [
        11.7608,
        77.463,
        12.8784,
        78.734
      ]
    },
    {
      "id": "tamil_nadu_dindigul",
      "name": "Dindigul",
      "state": "Tamil Nadu",
      "centroid": [
        10.4152,
        77.7873
      ],
      "bbox": [
        10.0076,
        77.2533,
        10.8227,
        78.3212
      ]
    },
    {
      "id": "tamil_nadu_erode",
      "name": "Erode",
      "state": "Tamil Nadu",
      "centroid": [
        11.2698,
        77.3731
      ],
      "bbox": [
        10.5953,
        76.8278,
        11.9442,
        77.9185
      ]
    },
    {
      "id": "tamil_nadu_kancheepuram",
      "name": "Kancheepuram",
      "state": "Tamil Nadu",
      "centroid": [
        12.6716,
        79.9045
      ],
      "bbox": [
        12.2143,
        79.5466,
        13.1289,
        80.2624
      ]
    },
    {
      "id": "tamil_nadu_kanniyakumari",
      "name": "Kanniyakumari",
      "state": "Tamil Nadu",
      "centroid": [
        8.3238,
        77.3329
      ],
      "bbox": [
        8.0765,
        77.0907,
        8.571,
        77.5751
      ]
    },
    {
      "id": "tamil_nadu_karur",
      "name": "Karur",
      "state": "Tamil Nadu",
      "centroid": [
        10.8088,
        78.1539
      ],
      "bbox": [
        10.5352,
        77.7363,
        11.0825,
        78.5714
      ]
    },
    {
      "id": "tamil_nadu_madurai",
      "name": "Madurai",
      "state": "Tamil Nadu",
      "centroid": [
        9.9251,
        77.9512
      ],
      "bbox": [
        9.5531,
        77.448,
        10.2971,
        78.4544
      ]
    },
    {
      "id": "tamil_nadu_nagapattinam",
      "name": "Nagapattinam",
      "state": "Tamil Nadu",
      "centroid": [
        10.846,
        79.6885
      ],
      "bbox": [
        10.2729,
        79.4931,
        11.4191,
        79.884
      ]
    },
    {
      "id": "tamil_nadu_namakkal",
      "name": "Namakkal",
      "state": "Tamil Nadu",
      "centroid": [
        11.2909,
        78.0718
      ],
      "bbox": [
        10.9997,
        77.6711,
        11.5821,
        78.4725
      ]
    },
    {
      "id": "tamil_nadu_nilgiris",
      "name": "Nilgiris",
      "state": "Tamil Nadu",
      "centroid": [
        11.4391,
        76.6157
      ],
      "bbox": [
        11.1802,
        76.2257,
        11.698,
        77.0058
      ]
    },
    {
      "id": "tamil_nadu_perambalur",
      "name": "Perambalur",
      "state": "Tamil Nadu",
      "centroid": [
        11.2732,
        78.8863
      ],
      "bbox": [
        11.0393,
        78.6181,
        11.507,
        79.1545
      ]
    },
    {
      "id": "tamil_nadu_pudukkottai",
      "name": "Pudukkottai",
      "state": "Tamil Nadu",
      "centroid": [
        10.2754,
        78.8505
      ],
      "bbox": [
        9.8313,
        78.4336,
        10.7195,
        79.2674
      ]
    },
    {
      "id": "tamil_nadu_ramanathapuram",
      "name": "Ramanathapuram",
      "state": "Tamil Nadu",
      "centroid": [
        9.5063,
        78.8637
      ],
      "bbox": [
        9.081,
        78.1969,
        9.9316,
        79.5304
      ]
    },
    {
      "id": "tamil_nadu_salem",
      "name": "Salem",
      "state": "Tamil Nadu",
      "centroid": [
        11.6331,
        78.2341
      ],
      "bbox": [
        11.302,
        77.638,
        11.9642,
        78.8303
      ]
    },
    {
      "id": "tamil_nadu_sivaganga",
      "name": "Sivaganga",
      "state": "Tamil Nadu",
      "centroid": [
        9.9504,
        78.5524
      ],
      "bbox": [
        9.5057,
        78.1089,
        10.395,
        78.996
      ]
    },
    {
      "id": "tamil_nadu_thanjavur",
      "name": "Thanjavur",
      "state": "Tamil Nadu",
      "centroid": [
        10.6454,
        79.1598
      ],
      "bbox": [
        10.1245,
        78.7622,
        11.1663,
        79.5574
      ]
    },
    {
      "id": "tamil_nadu_theni",
      "name": "Theni",
      "state": "Tamil Nadu",
      "centroid": [
        9.8569,
        77.4329
      ],
      "bbox": [
        9.5087,
        77.1519,
        10.2052,
        77.7139
      ]
    },
    {
      "id": "tamil_nadu_thiruvallur",
      "name": "Thiruvallur",
      "state": "Tamil Nadu",
      "centroid": [
        13.2353,
        79.8101
      ],
      "bbox": [
        12.933,
        79.2735,
        13.5376,
        80.3468
      ]
    },
    {
      "id": "tamil_nadu_thiruvarur",
      "name": "Thiruvarur",
      "state": "Tamil Nadu",
      "centroid": [
        10.6374,
        79.5396
      ],
      "bbox": [
        10.274,
        79.2827,
        11.0008,
        79.7965
      ]
    },
    {
      "id": "tamil_nadu_thoothukudi",
      "name": "Thoothukudi",
      "state": "Tamil Nadu",
      "centroid": [
        8.8355,
        78.0115
      ],
      "bbox": [
        8.3113,
        77.6554,
        9.3597,
        78.3676
      ]
    },
    {
      "id": "tamil_nadu_tiruchchirappalli",
      "name": "Tiruchchirappalli",
      "state": "Tamil Nadu",
      "centroid": [
        10.8364,
        78.5746
      ],
      "bbox": [
        10.2809,
        78.1504,
        11.392,
        78.9988
      ]
    },
    {
      "id": "tamil_nadu_tirunelveli_kattabo",
      "name": "Tirunelveli Kattabo",
      "state": "Tamil Nadu",
      "centroid": [
        8.7706,
        77.5478
      ],
      "bbox": [
        8.1329,
        77.1322,
        9.4082,
        77.9635
      ]
    },
    {
      "id": "tamil_nadu_tiruvannamalai",
      "name": "Tiruvannamalai",
      "state": "Tamil Nadu",
      "centroid": [
        12.4138,
        79.1815
      ],
      "bbox": [
        11.9678,
        78.6201,
        12.8597,
        79.743
      ]
    },
    {
      "id": "tamil_nadu_vellore",
      "name": "Vellore",
      "state": "Tamil Nadu",
      "centroid": [
        12.721,
        79.0865
      ],
      "bbox": [
        12.2463,
        78.3962,
        13.1957,
        79.7768
      ]
    },
    {
      "id": "tamil_nadu_villupuram",
      "name": "Villupuram",
      "state": "Tamil Nadu",
      "centroid": [
        11.9631,
        79.3102
      ],
      "bbox": [
        11.4896,
        78.6134,
        12.4366,
        80.0071
      ]
    },
    {
      "id": "tamil_nadu_virudhunagar",
      "name": "Virudhunagar",
      "state": "Tamil Nadu",
      "centroid": [
        9.4809,
        77.8621
      ],
      "bbox": [
        9.1881,
        77.3241,
        9.7736,
        78.4
      ]
    }
  ],
  "Tripura": [
    {
      "id": "tripura_dhalai",
      "name": "Dhalai",
      "state": "Tripura",
      "centroid": [
        23.8421,
        91.9598
      ],
      "bbox": [
        23.4371,
        91.7435,
        24.2471,
        92.1762
      ]
    },
    {
      "id": "tripura_north_tripura",
      "name": "North Tripura",
      "state": "Tripura",
      "centroid": [
        24.0956,
        92.1195
      ],
      "bbox": [
        23.6573,
        91.9021,
        24.534,
        92.3368
      ]
    },
    {
      "id": "tripura_south_tripura",
      "name": "South Tripura",
      "state": "Tripura",
      "centroid": [
        23.3541,
        91.6089
      ],
      "bbox": [
        22.9442,
        91.3168,
        23.7639,
        91.9011
      ]
    },
    {
      "id": "tripura_west_tripura",
      "name": "West Tripura",
      "state": "Tripura",
      "centroid": [
        23.7522,
        91.4708
      ],
      "bbox": [
        23.2739,
        91.1545,
        24.2304,
        91.787
      ]
    }
  ],
  "Uttar Pradesh": [
    {
      "id": "uttar_pradesh_agra",
      "name": "Agra",
      "state": "Uttar Pradesh",
      "centroid": [
        27.024,
        78.1302
      ],
      "bbox": [
        26.7467,
        77.4175,
        27.3013,
        78.8428
      ]
    },
    {
      "id": "uttar_pradesh_aligarh",
      "name": "Aligarh",
      "state": "Uttar Pradesh",
      "centroid": [
        27.8793,
        78.0402
      ],
      "bbox": [
        27.5812,
        77.47,
        28.1775,
        78.6104
      ]
    },
    {
      "id": "uttar_pradesh_allahabad",
      "name": "Allahabad",
      "state": "Uttar Pradesh",
      "centroid": [
        25.2825,
        81.9282
      ],
      "bbox": [
        24.8099,
        81.5117,
        25.7551,
        82.3447
      ]
    },
    {
      "id": "uttar_pradesh_ambedkar_nagar",
      "name": "Ambedkar Nagar",
      "state": "Uttar Pradesh",
      "centroid": [
        26.41,
        82.6686
      ],
      "bbox": [
        26.1639,
        82.2116,
        26.6562,
        83.1256
      ]
    },
    {
      "id": "uttar_pradesh_auraiya",
      "name": "Auraiya",
      "state": "Uttar Pradesh",
      "centroid": [
        26.6608,
        79.3983
      ],
      "bbox": [
        26.3693,
        79.0468,
        26.9523,
        79.7499
      ]
    },
    {
      "id": "uttar_pradesh_azamgarh",
      "name": "Azamgarh",
      "state": "Uttar Pradesh",
      "centroid": [
        26.0463,
        83.0793
      ],
      "bbox": [
        25.639,
        82.6596,
        26.4535,
        83.4989
      ]
    },
    {
      "id": "uttar_pradesh_badaun",
      "name": "Badaun",
      "state": "Uttar Pradesh",
      "centroid": [
        28.073,
        78.8825
      ],
      "bbox": [
        27.6576,
        78.2738,
        28.4885,
        79.4911
      ]
    },
    {
      "id": "uttar_pradesh_baghpat",
      "name": "Baghpat",
      "state": "Uttar Pradesh",
      "centroid": [
        29.0418,
        77.3
      ],
      "bbox": [
        28.782,
        77.122,
        29.3015,
        77.4781
      ]
    },
    {
      "id": "uttar_pradesh_bahraich",
      "name": "Bahraich",
      "state": "Uttar Pradesh",
      "centroid": [
        27.7367,
        81.4143
      ],
      "bbox": [
        27.0639,
        81.0246,
        28.4095,
        81.804
      ]
    },
    {
      "id": "uttar_pradesh_ballia",
      "name": "Ballia",
      "state": "Uttar Pradesh",
      "centroid": [
        25.878,
        84.1496
      ],
      "bbox": [
        25.5617,
        83.6686,
        26.1943,
        84.6306
      ]
    },
    {
      "id": "uttar_pradesh_balrampur",
      "name": "Balrampur",
      "state": "Uttar Pradesh",
      "centroid": [
        27.449,
        82.3859
      ],
      "bbox": [
        27.0505,
        82.0139,
        27.8475,
        82.7579
      ]
    },
    {
      "id": "uttar_pradesh_banda",
      "name": "Banda",
      "state": "Uttar Pradesh",
      "centroid": [
        25.4592,
        80.5635
      ],
      "bbox": [
        25.0029,
        80.0961,
        25.9155,
        81.0308
      ]
    },
    {
      "id": "uttar_pradesh_bara_banki",
      "name": "Bara Banki",
      "state": "Uttar Pradesh",
      "centroid": [
        26.9438,
        81.3852
      ],
      "bbox": [
        26.5255,
        80.9171,
        27.3621,
        81.8533
      ]
    },
    {
      "id": "uttar_pradesh_bareilly",
      "name": "Bareilly",
      "state": "Uttar Pradesh",
      "centroid": [
        28.4595,
        79.3676
      ],
      "bbox": [
        28.0265,
        78.9892,
        28.8925,
        79.7461
      ]
    },
    {
      "id": "uttar_pradesh_basti",
      "name": "Basti",
      "state": "Uttar Pradesh",
      "centroid": [
        26.7822,
        82.5911
      ],
      "bbox": [
        26.5411,
        82.2136,
        27.0233,
        82.9687
      ]
    },
    {
      "id": "uttar_pradesh_bijnor",
      "name": "Bijnor",
      "state": "Uttar Pradesh",
      "centroid": [
        29.4157,
        78.4522
      ],
      "bbox": [
        29.0353,
        77.9816,
        29.7962,
        78.9229
      ]
    },
    {
      "id": "uttar_pradesh_bulandshahr",
      "name": "Bulandshahr",
      "state": "Uttar Pradesh",
      "centroid": [
        28.3971,
        78.0306
      ],
      "bbox": [
        28.0748,
        77.5854,
        28.7195,
        78.4758
      ]
    },
    {
      "id": "uttar_pradesh_chandauli",
      "name": "Chandauli",
      "state": "Uttar Pradesh",
      "centroid": [
        25.1253,
        83.2753
      ],
      "bbox": [
        24.7162,
        83.004,
        25.5343,
        83.5466
      ]
    },
    {
      "id": "uttar_pradesh_chitrakoot",
      "name": "Chitrakoot",
      "state": "Uttar Pradesh",
      "centroid": [
        25.2202,
        81.1181
      ],
      "bbox": [
        24.8921,
        80.6804,
        25.5483,
        81.5559
      ]
    },
    {
      "id": "uttar_pradesh_deoria",
      "name": "Deoria",
      "state": "Uttar Pradesh",
      "centroid": [
        26.4265,
        83.8261
      ],
      "bbox": [
        26.0931,
        83.4704,
        26.76,
        84.1817
      ]
    },
    {
      "id": "uttar_pradesh_etah",
      "name": "Etah",
      "state": "Uttar Pradesh",
      "centroid": [
        27.6828,
        78.7182
      ],
      "bbox": [
        27.314,
        78.171,
        28.0516,
        79.2653
      ]
    },
    {
      "id": "uttar_pradesh_etawah",
      "name": "Etawah",
      "state": "Uttar Pradesh",
      "centroid": [
        26.7493,
        79.0371
      ],
      "bbox": [
        26.4868,
        78.7334,
        27.0119,
        79.3409
      ]
    },
    {
      "id": "uttar_pradesh_faizabad",
      "name": "Faizabad",
      "state": "Uttar Pradesh",
      "centroid": [
        26.6251,
        82.0686
      ],
      "bbox": [
        26.4099,
        81.6673,
        26.8403,
        82.47
      ]
    },
    {
      "id": "uttar_pradesh_farrukhabad",
      "name": "Farrukhabad",
      "state": "Uttar Pradesh",
      "centroid": [
        27.4423,
        79.4256
      ],
      "bbox": [
        27.1644,
        79.1142,
        27.7202,
        79.7369
      ]
    },
    {
      "id": "uttar_pradesh_fatehpur",
      "name": "Fatehpur",
      "state": "Uttar Pradesh",
      "centroid": [
        25.8377,
        80.7674
      ],
      "bbox": [
        25.4438,
        80.2069,
        26.2316,
        81.3279
      ]
    },
    {
      "id": "uttar_pradesh_firozabad",
      "name": "Firozabad",
      "state": "Uttar Pradesh",
      "centroid": [
        27.1994,
        78.3827
      ],
      "bbox": [
        26.8831,
        77.952,
        27.5157,
        78.8134
      ]
    },
    {
      "id": "uttar_pradesh_gautam_buddha_nagar",
      "name": "Gautam Buddha Nagar",
      "state": "Uttar Pradesh",
      "centroid": [
        28.3843,
        77.5233
      ],
      "bbox": [
        28.0814,
        77.2936,
        28.6871,
        77.7531
      ]
    },
    {
      "id": "uttar_pradesh_ghaziabad",
      "name": "Ghaziabad",
      "state": "Uttar Pradesh",
      "centroid": [
        28.7417,
        77.6966
      ],
      "bbox": [
        28.5518,
        77.1944,
        28.9317,
        78.1987
      ]
    },
    {
      "id": "uttar_pradesh_ghazipur",
      "name": "Ghazipur",
      "state": "Uttar Pradesh",
      "centroid": [
        25.6024,
        83.5055
      ],
      "bbox": [
        25.3081,
        83.0557,
        25.8967,
        83.9554
      ]
    },
    {
      "id": "uttar_pradesh_gonda",
      "name": "Gonda",
      "state": "Uttar Pradesh",
      "centroid": [
        27.115,
        82.052
      ],
      "bbox": [
        26.7826,
        81.4973,
        27.4473,
        82.6066
      ]
    },
    {
      "id": "uttar_pradesh_gorakhpur",
      "name": "Gorakhpur",
      "state": "Uttar Pradesh",
      "centroid": [
        26.612,
        83.3622
      ],
      "bbox": [
        26.2205,
        83.0614,
        27.0035,
        83.663
      ]
    },
    {
      "id": "uttar_pradesh_hamirpur",
      "name": "Hamirpur",
      "state": "Uttar Pradesh",
      "centroid": [
        25.7864,
        79.8483
      ],
      "bbox": [
        25.4055,
        79.3527,
        26.1673,
        80.3439
      ]
    },
    {
      "id": "uttar_pradesh_hardoi",
      "name": "Hardoi",
      "state": "Uttar Pradesh",
      "centroid": [
        27.3415,
        80.248
      ],
      "bbox": [
        26.8928,
        79.6781,
        27.7902,
        80.8179
      ]
    },
    {
      "id": "uttar_pradesh_hathras",
      "name": "Hathras",
      "state": "Uttar Pradesh",
      "centroid": [
        27.5579,
        78.1942
      ],
      "bbox": [
        27.2838,
        77.8697,
        27.832,
        78.5186
      ]
    },
    {
      "id": "uttar_pradesh_jalaun",
      "name": "Jalaun",
      "state": "Uttar Pradesh",
      "centroid": [
        26.1114,
        79.4361
      ],
      "bbox": [
        25.7747,
        78.9236,
        26.448,
        79.9486
      ]
    },
    {
      "id": "uttar_pradesh_jaunpur",
      "name": "Jaunpur",
      "state": "Uttar Pradesh",
      "centroid": [
        25.7975,
        82.5971
      ],
      "bbox": [
        25.3954,
        82.1122,
        26.1996,
        83.0821
      ]
    },
    {
      "id": "uttar_pradesh_jhansi",
      "name": "Jhansi",
      "state": "Uttar Pradesh",
      "centroid": [
        25.5331,
        78.8535
      ],
      "bbox": [
        25.1108,
        78.2942,
        25.9555,
        79.4128
      ]
    },
    {
      "id": "uttar_pradesh_jyotiba_phule_nagar",
      "name": "Jyotiba Phule Nagar",
      "state": "Uttar Pradesh",
      "centroid": [
        28.7942,
        78.3736
      ],
      "bbox": [
        28.409,
        78.0476,
        29.1795,
        78.6996
      ]
    },
    {
      "id": "uttar_pradesh_kannauj",
      "name": "Kannauj",
      "state": "Uttar Pradesh",
      "centroid": [
        27.0034,
        79.6604
      ],
      "bbox": [
        26.7751,
        79.3097,
        27.2317,
        80.0112
      ]
    },
    {
      "id": "uttar_pradesh_kanpur",
      "name": "Kanpur",
      "state": "Uttar Pradesh",
      "centroid": [
        26.411,
        80.337
      ],
      "bbox": [
        26.1821,
        80.116,
        26.6399,
        80.558
      ]
    },
    {
      "id": "uttar_pradesh_kanpur_dehat",
      "name": "Kanpur Dehat",
      "state": "Uttar Pradesh",
      "centroid": [
        26.4443,
        79.9804
      ],
      "bbox": [
        25.9223,
        79.495,
        26.9662,
        80.4658
      ]
    },
    {
      "id": "uttar_pradesh_kaushambi",
      "name": "Kaushambi",
      "state": "Uttar Pradesh",
      "centroid": [
        25.5382,
        81.5228
      ],
      "bbox": [
        25.2622,
        81.1408,
        25.8143,
        81.9047
      ]
    },
    {
      "id": "uttar_pradesh_kushinagar",
      "name": "Kushinagar",
      "state": "Uttar Pradesh",
      "centroid": [
        26.9256,
        83.9665
      ],
      "bbox": [
        26.5503,
        83.5187,
        27.3008,
        84.4144
      ]
    },
    {
      "id": "uttar_pradesh_lakhimpur_kheri",
      "name": "Lakhimpur Kheri",
      "state": "Uttar Pradesh",
      "centroid": [
        28.1851,
        80.6561
      ],
      "bbox": [
        27.6786,
        80.0148,
        28.6915,
        81.2974
      ]
    },
    {
      "id": "uttar_pradesh_lalitpur",
      "name": "Lalitpur",
      "state": "Uttar Pradesh",
      "centroid": [
        24.7031,
        78.5755
      ],
      "bbox": [
        24.1802,
        78.1633,
        25.226,
        78.9878
      ]
    },
    {
      "id": "uttar_pradesh_lucknow",
      "name": "Lucknow",
      "state": "Uttar Pradesh",
      "centroid": [
        26.8353,
        80.88
      ],
      "bbox": [
        26.5064,
        80.5507,
        27.1643,
        81.2093
      ]
    },
    {
      "id": "uttar_pradesh_maharajganj",
      "name": "Maharajganj",
      "state": "Uttar Pradesh",
      "centroid": [
        27.1862,
        83.5193
      ],
      "bbox": [
        26.8928,
        83.1129,
        27.4795,
        83.9257
      ]
    },
    {
      "id": "uttar_pradesh_mahoba",
      "name": "Mahoba",
      "state": "Uttar Pradesh",
      "centroid": [
        25.3651,
        79.7057
      ],
      "bbox": [
        25.0828,
        79.2694,
        25.6473,
        80.142
      ]
    },
    {
      "id": "uttar_pradesh_mainpuri",
      "name": "Mainpuri",
      "state": "Uttar Pradesh",
      "centroid": [
        27.2058,
        79.0555
      ],
      "bbox": [
        26.9363,
        78.6801,
        27.4754,
        79.4308
      ]
    },
    {
      "id": "uttar_pradesh_mathura",
      "name": "Mathura",
      "state": "Uttar Pradesh",
      "centroid": [
        27.6048,
        77.6236
      ],
      "bbox": [
        27.2391,
        77.2758,
        27.9705,
        77.9715
      ]
    },
    {
      "id": "uttar_pradesh_mau",
      "name": "Mau",
      "state": "Uttar Pradesh",
      "centroid": [
        26.0407,
        83.4866
      ],
      "bbox": [
        25.8003,
        83.1695,
        26.2811,
        83.8037
      ]
    },
    {
      "id": "uttar_pradesh_meerut",
      "name": "Meerut",
      "state": "Uttar Pradesh",
      "centroid": [
        29.005,
        77.7854
      ],
      "bbox": [
        28.742,
        77.4397,
        29.2679,
        78.1312
      ]
    },
    {
      "id": "uttar_pradesh_mirzapur",
      "name": "Mirzapur",
      "state": "Uttar Pradesh",
      "centroid": [
        24.9376,
        82.6257
      ],
      "bbox": [
        24.5974,
        82.076,
        25.2778,
        83.1754
      ]
    },
    {
      "id": "uttar_pradesh_moradabad",
      "name": "Moradabad",
      "state": "Uttar Pradesh",
      "centroid": [
        28.8139,
        78.6757
      ],
      "bbox": [
        28.3393,
        78.3867,
        29.2886,
        78.9646
      ]
    },
    {
      "id": "uttar_pradesh_muzaffarnagar",
      "name": "Muzaffarnagar",
      "state": "Uttar Pradesh",
      "centroid": [
        29.4504,
        77.6052
      ],
      "bbox": [
        29.186,
        77.0849,
        29.7148,
        78.1255
      ]
    },
    {
      "id": "uttar_pradesh_pilibhit",
      "name": "Pilibhit",
      "state": "Uttar Pradesh",
      "centroid": [
        28.5072,
        80.0052
      ],
      "bbox": [
        28.1211,
        79.5869,
        28.8934,
        80.4235
      ]
    },
    {
      "id": "uttar_pradesh_pratapgarh",
      "name": "Pratapgarh",
      "state": "Uttar Pradesh",
      "centroid": [
        25.8772,
        81.8732
      ],
      "bbox": [
        25.5717,
        81.3183,
        26.1826,
        82.4282
      ]
    },
    {
      "id": "uttar_pradesh_rae_bareli",
      "name": "Rae Bareli",
      "state": "Uttar Pradesh",
      "centroid": [
        26.212,
        81.1387
      ],
      "bbox": [
        25.8143,
        80.6672,
        26.6096,
        81.6102
      ]
    },
    {
      "id": "uttar_pradesh_rampur",
      "name": "Rampur",
      "state": "Uttar Pradesh",
      "centroid": [
        28.7816,
        79.115
      ],
      "bbox": [
        28.3909,
        78.8274,
        29.1723,
        79.4026
      ]
    },
    {
      "id": "uttar_pradesh_saharanpur",
      "name": "Saharanpur",
      "state": "Uttar Pradesh",
      "centroid": [
        29.9895,
        77.5222
      ],
      "bbox": [
        29.5664,
        77.113,
        30.4125,
        77.9315
      ]
    },
    {
      "id": "uttar_pradesh_sant_kabir_nagar",
      "name": "Sant Kabir Nagar",
      "state": "Uttar Pradesh",
      "centroid": [
        26.7308,
        83.0181
      ],
      "bbox": [
        26.4112,
        82.8185,
        27.0503,
        83.2177
      ]
    },
    {
      "id": "uttar_pradesh_sant_ravi_das_nagar",
      "name": "Sant Ravi Das Nagar",
      "state": "Uttar Pradesh",
      "centroid": [
        25.3614,
        82.4444
      ],
      "bbox": [
        25.1834,
        82.1862,
        25.5393,
        82.7025
      ]
    },
    {
      "id": "uttar_pradesh_shahjahanpur",
      "name": "Shahjahanpur",
      "state": "Uttar Pradesh",
      "centroid": [
        27.9702,
        79.8406
      ],
      "bbox": [
        27.4773,
        79.3213,
        28.463,
        80.3598
      ]
    },
    {
      "id": "uttar_pradesh_shravasti",
      "name": "Shravasti",
      "state": "Uttar Pradesh",
      "centroid": [
        27.6326,
        81.8173
      ],
      "bbox": [
        27.2719,
        81.4366,
        27.9933,
        82.198
      ]
    },
    {
      "id": "uttar_pradesh_siddharth_nagar",
      "name": "Siddharth Nagar",
      "state": "Uttar Pradesh",
      "centroid": [
        27.2101,
        82.8621
      ],
      "bbox": [
        26.9142,
        82.4295,
        27.5059,
        83.2947
      ]
    },
    {
      "id": "uttar_pradesh_sitapur",
      "name": "Sitapur",
      "state": "Uttar Pradesh",
      "centroid": [
        27.5081,
        80.8509
      ],
      "bbox": [
        27.1048,
        80.2941,
        27.9113,
        81.4076
      ]
    },
    {
      "id": "uttar_pradesh_sonbhadra",
      "name": "Sonbhadra",
      "state": "Uttar Pradesh",
      "centroid": [
        24.3901,
        83.0301
      ],
      "bbox": [
        23.8728,
        82.5184,
        24.9074,
        83.5417
      ]
    },
    {
      "id": "uttar_pradesh_sultanpur",
      "name": "Sultanpur",
      "state": "Uttar Pradesh",
      "centroid": [
        26.3222,
        82.1059
      ],
      "bbox": [
        25.9757,
        81.5265,
        26.6687,
        82.6853
      ]
    },
    {
      "id": "uttar_pradesh_unnao",
      "name": "Unnao",
      "state": "Uttar Pradesh",
      "centroid": [
        26.5775,
        80.5419
      ],
      "bbox": [
        26.1194,
        80.0421,
        27.0356,
        81.0417
      ]
    },
    {
      "id": "uttar_pradesh_varanasi",
      "name": "Varanasi",
      "state": "Uttar Pradesh",
      "centroid": [
        25.376,
        82.9245
      ],
      "bbox": [
        25.1692,
        82.6626,
        25.5828,
        83.1863
      ]
    }
  ],
  "Uttarakhand": [
    {
      "id": "uttarakhand_almora",
      "name": "Almora",
      "state": "Uttarakhand",
      "centroid": [
        29.7103,
        79.5419
      ],
      "bbox": [
        29.4321,
        79.0241,
        29.9885,
        80.0597
      ]
    },
    {
      "id": "uttarakhand_bageshwar",
      "name": "Bageshwar",
      "state": "Uttarakhand",
      "centroid": [
        30.0057,
        79.8019
      ],
      "bbox": [
        29.6907,
        79.4568,
        30.3208,
        80.147
      ]
    },
    {
      "id": "uttarakhand_chamoli",
      "name": "Chamoli",
      "state": "Uttarakhand",
      "centroid": [
        30.5063,
        79.5533
      ],
      "bbox": [
        29.9322,
        79.0165,
        31.0803,
        80.0901
      ]
    },
    {
      "id": "uttarakhand_champawat",
      "name": "Champawat",
      "state": "Uttarakhand",
      "centroid": [
        29.2921,
        80.0532
      ],
      "bbox": [
        29.058,
        79.7863,
        29.5262,
        80.3201
      ]
    },
    {
      "id": "uttarakhand_dehra_dun",
      "name": "Dehra Dun",
      "state": "Uttarakhand",
      "centroid": [
        30.4639,
        77.9306
      ],
      "bbox": [
        29.9479,
        77.5622,
        30.9799,
        78.299
      ]
    },
    {
      "id": "uttarakhand_haridwar",
      "name": "Haridwar",
      "state": "Uttarakhand",
      "centroid": [
        29.8983,
        78.0169
      ],
      "bbox": [
        29.5459,
        77.702,
        30.2507,
        78.3317
      ]
    },
    {
      "id": "uttarakhand_naini_tal",
      "name": "Naini Tal",
      "state": "Uttarakhand",
      "centroid": [
        29.3015,
        79.3999
      ],
      "bbox": [
        28.9881,
        78.8319,
        29.6149,
        79.9679
      ]
    },
    {
      "id": "uttarakhand_pauri_garhwal",
      "name": "Pauri Garhwal",
      "state": "Uttarakhand",
      "centroid": [
        29.8865,
        78.7011
      ],
      "bbox": [
        29.4562,
        78.1811,
        30.3168,
        79.2211
      ]
    },
    {
      "id": "uttarakhand_pithoragarh",
      "name": "Pithoragarh",
      "state": "Uttarakhand",
      "centroid": [
        30.1259,
        80.4143
      ],
      "bbox": [
        29.4384,
        79.8087,
        30.8134,
        81.02
      ]
    },
    {
      "id": "uttarakhand_rudra_prayag",
      "name": "Rudra Prayag",
      "state": "Uttarakhand",
      "centroid": [
        30.5533,
        79.1191
      ],
      "bbox": [
        30.2945,
        78.896,
        30.8121,
        79.3423
      ]
    },
    {
      "id": "uttarakhand_tehri_garhwal",
      "name": "Tehri Garhwal",
      "state": "Uttarakhand",
      "centroid": [
        30.4717,
        78.4865
      ],
      "bbox": [
        30.0591,
        77.9263,
        30.8842,
        79.0468
      ]
    },
    {
      "id": "uttarakhand_udham_singh_nagar",
      "name": "Udham Singh Nagar",
      "state": "Uttarakhand",
      "centroid": [
        29.0504,
        79.4369
      ],
      "bbox": [
        28.7156,
        78.7139,
        29.3853,
        80.1599
      ]
    },
    {
      "id": "uttarakhand_uttarkashi",
      "name": "Uttarkashi",
      "state": "Uttarakhand",
      "centroid": [
        30.9732,
        78.5628
      ],
      "bbox": [
        30.474,
        77.7333,
        31.4723,
        79.3924
      ]
    }
  ],
  "West Bengal": [
    {
      "id": "west_bengal_bankura",
      "name": "Bankura",
      "state": "West Bengal",
      "centroid": [
        23.1304,
        87.1834
      ],
      "bbox": [
        22.6228,
        86.6049,
        23.638,
        87.762
      ]
    },
    {
      "id": "west_bengal_barddhaman",
      "name": "Barddhaman",
      "state": "West Bengal",
      "centroid": [
        23.4054,
        87.6035
      ],
      "bbox": [
        22.9308,
        86.7909,
        23.88,
        88.4161
      ]
    },
    {
      "id": "west_bengal_birbhum",
      "name": "Birbhum",
      "state": "West Bengal",
      "centroid": [
        24.06,
        87.5537
      ],
      "bbox": [
        23.5377,
        87.0845,
        24.5823,
        88.0229
      ]
    },
    {
      "id": "west_bengal_dakshin_dinajpur",
      "name": "Dakshin Dinajpur",
      "state": "West Bengal",
      "centroid": [
        25.3818,
        88.5944
      ],
      "bbox": [
        25.1671,
        88.1776,
        25.5965,
        89.0113
      ]
    },
    {
      "id": "west_bengal_darjiling",
      "name": "Darjiling",
      "state": "West Bengal",
      "centroid": [
        26.8336,
        88.4344
      ],
      "bbox": [
        26.4463,
        87.9901,
        27.221,
        88.8787
      ]
    },
    {
      "id": "west_bengal_east_midnapore",
      "name": "East Midnapore",
      "state": "West Bengal",
      "centroid": [
        22.0596,
        87.8088
      ],
      "bbox": [
        21.6087,
        87.4239,
        22.5105,
        88.1936
      ]
    },
    {
      "id": "west_bengal_haora",
      "name": "Haora",
      "state": "West Bengal",
      "centroid": [
        22.498,
        88.1037
      ],
      "bbox": [
        22.2197,
        87.8418,
        22.7763,
        88.3655
      ]
    },
    {
      "id": "west_bengal_hugli",
      "name": "Hugli",
      "state": "West Bengal",
      "centroid": [
        22.9096,
        88.0037
      ],
      "bbox": [
        22.594,
        87.503,
        23.2251,
        88.5045
      ]
    },
    {
      "id": "west_bengal_jalpaiguri",
      "name": "Jalpaiguri",
      "state": "West Bengal",
      "centroid": [
        26.6645,
        89.1339
      ],
      "bbox": [
        26.3328,
        88.3903,
        26.9962,
        89.8775
      ]
    },
    {
      "id": "west_bengal_kochbihar",
      "name": "Kochbihar",
      "state": "West Bengal",
      "centroid": [
        26.2552,
        89.3029
      ],
      "bbox": [
        25.9646,
        88.7442,
        26.5458,
        89.8615
      ]
    },
    {
      "id": "west_bengal_kolkata",
      "name": "Kolkata",
      "state": "West Bengal",
      "centroid": [
        22.5623,
        88.339
      ],
      "bbox": [
        22.4949,
        88.2707,
        22.6297,
        88.4073
      ]
    },
    {
      "id": "west_bengal_maldah",
      "name": "Maldah",
      "state": "West Bengal",
      "centroid": [
        25.0971,
        88.1111
      ],
      "bbox": [
        24.6563,
        87.7591,
        25.538,
        88.463
      ]
    },
    {
      "id": "west_bengal_murshidabad",
      "name": "Murshidabad",
      "state": "West Bengal",
      "centroid": [
        24.2863,
        88.2758
      ],
      "bbox": [
        23.7183,
        87.8139,
        24.8544,
        88.7378
      ]
    },
    {
      "id": "west_bengal_nadia",
      "name": "Nadia",
      "state": "West Bengal",
      "centroid": [
        23.4853,
        88.4667
      ],
      "bbox": [
        22.871,
        88.1332,
        24.0995,
        88.8001
      ]
    },
    {
      "id": "west_bengal_north_24_parganas",
      "name": "North 24 Parganas",
      "state": "West Bengal",
      "centroid": [
        22.4,
        88.7137
      ],
      "bbox": [
        21.5489,
        88.331,
        23.251,
        89.0964
      ]
    },
    {
      "id": "west_bengal_puruliya",
      "name": "Puruliya",
      "state": "West Bengal",
      "centroid": [
        23.1993,
        86.3603
      ],
      "bbox": [
        22.7015,
        85.8264,
        23.6972,
        86.8941
      ]
    },
    {
      "id": "west_bengal_south_24_parganas",
      "name": "South 24 Parganas",
      "state": "West Bengal",
      "centroid": [
        22.0808,
        88.418
      ],
      "bbox": [
        21.5394,
        88.0147,
        22.6222,
        88.8213
      ]
    },
    {
      "id": "west_bengal_uttar_dinajpur",
      "name": "Uttar Dinajpur",
      "state": "West Bengal",
      "centroid": [
        25.8698,
        88.1644
      ],
      "bbox": [
        25.2425,
        87.8036,
        26.4971,
        88.5252
      ]
    },
    {
      "id": "west_bengal_west_midnapore",
      "name": "West Midnapore",
      "state": "West Bengal",
      "centroid": [
        22.3548,
        87.2218
      ],
      "bbox": [
        21.7601,
        86.5551,
        22.9494,
        87.8886
      ]
    }
  ]
};

export const INDIAN_MONITORING_STATIONS: MonitoringStationInfo[] = [
  {
    "id": "delhi-anand-vihar",
    "name": "Anand Vihar CAAQMS",
    "city": "Delhi",
    "district": "East Delhi",
    "state": "Delhi",
    "country": "IN",
    "latitude": 28.6476,
    "longitude": 77.3158,
    "elevation": 216.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "delhi-ito",
    "name": "ITO Cross Road",
    "city": "Delhi",
    "district": "Central Delhi",
    "state": "Delhi",
    "country": "IN",
    "latitude": 28.6289,
    "longitude": 77.2405,
    "elevation": 218.0,
    "stationType": "CAAQMS_TRAFFIC"
  },
  {
    "id": "mumbai-bandra",
    "name": "Bandra Kurla Complex (BKC)",
    "city": "Mumbai",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "country": "IN",
    "latitude": 19.0657,
    "longitude": 72.8683,
    "elevation": 14.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "mumbai-worli",
    "name": "Worli Sea Face",
    "city": "Mumbai",
    "district": "Mumbai City",
    "state": "Maharashtra",
    "country": "IN",
    "latitude": 19.0178,
    "longitude": 72.8178,
    "elevation": 8.0,
    "stationType": "CAAQMS_COASTAL"
  },
  {
    "id": "bengaluru-btm",
    "name": "BTM Layout CAAQMS",
    "city": "Bengaluru",
    "district": "Bangalore",
    "state": "Karnataka",
    "country": "IN",
    "latitude": 12.9166,
    "longitude": 77.6101,
    "elevation": 920.0,
    "stationType": "CAAQMS_RESIDENTIAL"
  },
  {
    "id": "bengaluru-silk-board",
    "name": "Central Silk Board",
    "city": "Bengaluru",
    "district": "Bangalore",
    "state": "Karnataka",
    "country": "IN",
    "latitude": 12.9174,
    "longitude": 77.6229,
    "elevation": 915.0,
    "stationType": "CAAQMS_TRAFFIC"
  },
  {
    "id": "kolkata-victoria",
    "name": "Victoria Memorial Hall",
    "city": "Kolkata",
    "district": "Kolkata",
    "state": "West Bengal",
    "country": "IN",
    "latitude": 22.5448,
    "longitude": 88.3426,
    "elevation": 9.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "kolkata-jadavpur",
    "name": "Jadavpur University",
    "city": "Kolkata",
    "district": "Kolkata",
    "state": "West Bengal",
    "country": "IN",
    "latitude": 22.4988,
    "longitude": 88.3712,
    "elevation": 11.0,
    "stationType": "CAAQMS_SUBURBAN"
  },
  {
    "id": "chennai-alagappa",
    "name": "Alagappa Nagar CAAQMS",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "country": "IN",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "elevation": 16.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "chennai-manali",
    "name": "Manali Industrial Area",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "country": "IN",
    "latitude": 13.1677,
    "longitude": 80.2683,
    "elevation": 12.0,
    "stationType": "CAAQMS_INDUSTRIAL"
  },
  {
    "id": "hyderabad-sanathnagar",
    "name": "Sanathnagar Industrial Area",
    "city": "Hyderabad",
    "district": "Hyderabad",
    "state": "Telangana",
    "country": "IN",
    "latitude": 17.4578,
    "longitude": 78.4398,
    "elevation": 536.0,
    "stationType": "CAAQMS_INDUSTRIAL"
  },
  {
    "id": "hyderabad-zoo-park",
    "name": "Nehru Zoological Park",
    "city": "Hyderabad",
    "district": "Hyderabad",
    "state": "Telangana",
    "country": "IN",
    "latitude": 17.3616,
    "longitude": 78.4511,
    "elevation": 521.0,
    "stationType": "CAAQMS_RESIDENTIAL"
  },
  {
    "id": "ahmedabad-maninagar",
    "name": "Maninagar Station",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "country": "IN",
    "latitude": 22.9978,
    "longitude": 72.6033,
    "elevation": 53.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "pune-shivajinagar",
    "name": "Shivajinagar Station",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "country": "IN",
    "latitude": 18.5314,
    "longitude": 73.8446,
    "elevation": 560.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "lucknow-lalbagh",
    "name": "Lalbagh Municipal Office",
    "city": "Lucknow",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "country": "IN",
    "latitude": 26.8467,
    "longitude": 80.9462,
    "elevation": 123.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "patna-muradpur",
    "name": "Muradpur CAAQMS",
    "city": "Patna",
    "district": "Patna",
    "state": "Bihar",
    "country": "IN",
    "latitude": 25.6127,
    "longitude": 85.1588,
    "elevation": 53.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "jaipur-shastri-nagar",
    "name": "Shastri Nagar CAAQMS",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "country": "IN",
    "latitude": 26.9388,
    "longitude": 75.8012,
    "elevation": 431.0,
    "stationType": "CAAQMS_RESIDENTIAL"
  },
  {
    "id": "chandigarh-sector-22",
    "name": "Sector 22 CAAQMS",
    "city": "Chandigarh",
    "district": "Chandigarh",
    "state": "Chandigarh",
    "country": "IN",
    "latitude": 30.7298,
    "longitude": 76.7767,
    "elevation": 321.0,
    "stationType": "CAAQMS_URBAN"
  },
  {
    "id": "bhopal-tt-nagar",
    "name": "TT Nagar CAAQMS",
    "city": "Bhopal",
    "district": "Bhopal",
    "state": "Madhya Pradesh",
    "country": "IN",
    "latitude": 23.2599,
    "longitude": 77.4126,
    "elevation": 497.0,
    "stationType": "CAAQMS_RESIDENTIAL"
  },
  {
    "id": "nagpur-civil-lines",
    "name": "Civil Lines CAAQMS",
    "city": "Nagpur",
    "district": "Nagpur",
    "state": "Maharashtra",
    "country": "IN",
    "latitude": 21.1458,
    "longitude": 79.0882,
    "elevation": 311.0,
    "stationType": "CAAQMS_URBAN"
  }
];

/**
 * Resolves a district by state and district name
 */
export function getDistrictInfo(state: string, districtName: string): DistrictInfo | undefined {
  const districts = INDIA_DISTRICTS_BY_STATE[state];
  if (!districts) return undefined;
  const target = districtName.toLowerCase().trim();
  return districts.find(d => d.name.toLowerCase().trim() === target || d.name.toLowerCase().includes(target));
}

/**
 * Returns all real stations belonging to a district
 */
export function getStationsForDistrict(state: string, districtName: string): MonitoringStationInfo[] {
  const targetState = state.toLowerCase().trim();
  const targetDist = districtName.toLowerCase().trim();
  return INDIAN_MONITORING_STATIONS.filter(s => 
    s.state.toLowerCase().trim() === targetState &&
    (s.district.toLowerCase().trim() === targetDist || s.district.toLowerCase().includes(targetDist) || targetDist.includes(s.district.toLowerCase()))
  );
}
