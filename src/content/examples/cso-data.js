const xx = [];
for (let i = 0; i < 80; i++) xx.push(i);
const gent = (name, y, args) => {
  return { ...args, mode: "lines", name: name, x: xx, y: y, type: "scatter" };
};
export const data = [
  gent(
    "Min",
    [
      7.645027160644531, 7.645027160644531, 7.645027160644531,
      7.645027160644531, 7.645027160644531, 7.645027160644531,
      7.645027160644531, 7.604546546936035, 6.880276679992676,
      6.880276679992676, 5.152433395385742, 3.8273677825927734,
      3.226449966430664, 3.226449966430664, 3.226449966430664,
      3.1972522735595703, 3.1972522735595703, 3.1972522735595703,
      3.1972522735595703, 3.1972522735595703, 3.1972522735595703,
      1.0948715209960938, 1.0948715209960938, 1.0948715209960938,
      1.0948715209960938, 1.0948715209960938, 1.0948715209960938,
      1.0948715209960938, 0.3391551971435547, 0.3391551971435547,
      0.3289813995361328, 0.3289813995361328, 0.3289813995361328,
      0.3289813995361328, 0.3289813995361328, 0.3289813995361328,
      0.06373214721679688, 0.06373214721679688, 0.047008514404296875,
      0.047008514404296875, 0.047008514404296875, 0.047008514404296875,
      0.047008514404296875, 0.03764915466308594, 0.03764915466308594,
      0.03764915466308594, 0.03764915466308594, 0.03764915466308594,
      0.03764915466308594, 0.03764915466308594, 0.03764915466308594,
      0.03764915466308594, 0.02393341064453125, 0.019252777099609375,
      0.00445556640625, 0.00445556640625, 0.00445556640625, 0.00445556640625,
      0.00445556640625, 0.00445556640625, 0.00445556640625, 0.00445556640625,
      0.00445556640625, 0.00445556640625, 0.00445556640625, 0.00445556640625,
      0.0030670166015625, 0.0030670166015625, 0.002468109130859375,
      0.002468109130859375, 0.0019588470458984375, 0.0019588470458984375,
      0.0019588470458984375, 0.0014324188232421875, 0.0014324188232421875,
      0.00138092041015625, 0.0009002685546875, 0.0009002685546875,
      0.0009002685546875, 0.00064849853515625,
    ],
    { showlegend: true },
  ),
  gent(
    "Max",
    [
      22.019912719726562, 21.91777229309082, 21.954954147338867,
      20.90510368347168, 21.061349868774414, 20.799142837524414,
      19.890466690063477, 20.883634567260742, 20.816070556640625,
      19.31879425048828, 19.837051391601562, 19.066787719726562,
      12.48554515838623, 16.729917526245117, 17.48598861694336,
      14.410866737365723, 17.02151870727539, 14.015366554260254,
      17.372278213500977, 17.409374237060547, 19.00444984436035,
      11.745443344116211, 12.383716583251953, 13.53661060333252,
      12.047178268432617, 8.611015319824219, 7.886362075805664,
      6.730801582336426, 10.570916175842285, 8.55085563659668, 5.62059211730957,
      3.963092803955078, 4.466220855712891, 4.310670852661133,
      4.291513442993164, 3.859485626220703, 3.282045364379883,
      3.319660186767578, 3.2438602447509766, 3.917816162109375,
      3.570751190185547, 3.4212112426757812, 3.403839111328125,
      1.2661190032958984, 2.2389984130859375, 1.795501708984375,
      1.1630802154541016, 0.5934886932373047, 1.2589683532714844,
      1.6590213775634766, 2.1589603424072266, 1.170684814453125,
      0.8482036590576172, 1.4935741424560547, 0.7747859954833984,
      0.44936370849609375, 0.23242950439453125, 0.2060832977294922,
      0.29601287841796875, 0.5702667236328125, 0.3344306945800781,
      0.12857437133789062, 0.21638107299804688, 0.35437965393066406,
      0.11803436279296875, 0.03559303283691406, 0.09512710571289062,
      0.14494705200195312, 0.15103721618652344, 0.019519805908203125,
      0.12364768981933594, 0.10853385925292969, 0.06663703918457031,
      0.022424697875976562, 0.018918991088867188, 0.018224716186523438,
      0.016252517700195312, 0.03621482849121094, 0.03791046142578125,
      0.02753448486328125,
    ],
    {},
  ),
  gent(
    "Median",
    [
      21.03042221069336, 20.3514404296875, 19.073867797851562,
      18.300186157226562, 16.62813949584961, 14.338857650756836,
      12.715282440185547, 11.175718307495117, 10.134998321533203,
      9.907574653625488, 8.469886779785156, 7.624786853790283,
      7.190880298614502, 8.11850643157959, 7.010591983795166, 7.010591983795166,
      4.483912467956543, 4.320422172546387, 4.53919792175293, 4.548511505126953,
      4.633331298828125, 5.229033470153809, 3.6082143783569336,
      3.600062370300293, 3.3336973190307617, 3.410524368286133,
      3.338099479675293, 3.165231704711914, 2.7219161987304688,
      2.864203453063965, 2.498478889465332, 2.794645309448242,
      2.5263357162475586, 2.3813772201538086, 1.7131166458129883,
      1.5136947631835938, 0.9276895523071289, 0.9929876327514648,
      0.42855262756347656, 0.36969757080078125, 0.39517784118652344,
      0.3494386672973633, 0.46647071838378906, 0.30080127716064453,
      0.2292499542236328, 0.16422748565673828, 0.2097606658935547,
      0.24841785430908203, 0.19380855560302734, 0.1509990692138672,
      0.17147445678710938, 0.12294292449951172, 0.11290454864501953,
      0.10471248626708984, 0.07790184020996094, 0.05669212341308594,
      0.040866851806640625, 0.03783702850341797, 0.03831005096435547,
      0.038001060485839844, 0.04184246063232422, 0.027581214904785156,
      0.022110939025878906, 0.021945953369140625, 0.02072429656982422,
      0.01779937744140625, 0.011194229125976562, 0.010647773742675781,
      0.009765625, 0.009524345397949219, 0.006459236145019531,
      0.0069446563720703125, 0.007115364074707031, 0.005953788757324219,
      0.0045223236083984375, 0.004038810729980469, 0.0029268264770507812,
      0.0023679733276367188, 0.002613067626953125, 0.0021219253540039062,
    ],
    {},
  ),
  gent(
    "Average",
    [
      20.206737518310547, 18.918132781982422, 17.45844078063965,
      16.576061248779297, 15.408159255981445, 14.395026206970215,
      13.693811416625977, 12.477981567382812, 12.096416473388672,
      11.462444305419922, 9.888254165649414, 8.254084587097168,
      7.726882457733154, 8.41373348236084, 8.31326961517334, 7.561643123626709,
      6.143502235412598, 5.801794528961182, 6.127180576324463, 5.92273473739624,
      6.259318828582764, 5.455615520477295, 4.635842323303223,
      4.247400760650635, 4.066464424133301, 3.9337143898010254,
      3.5785272121429443, 3.360398054122925, 3.413655996322632,
      3.037014961242676, 2.651888370513916, 2.4884707927703857,
      2.528698205947876, 2.2516887187957764, 1.9349526166915894,
      1.5631272792816162, 1.2870897054672241, 1.226771354675293,
      0.8747623562812805, 0.9213194847106934, 0.9952568411827087,
      0.8039609789848328, 0.7112502455711365, 0.3913131654262543,
      0.40580129623413086, 0.2871163487434387, 0.3046123683452606,
      0.27681970596313477, 0.28386804461479187, 0.3780031204223633,
      0.3912425935268402, 0.22870635986328125, 0.19187965989112854,
      0.17423076927661896, 0.11537685245275497, 0.09165354073047638,
      0.0474085807800293, 0.056211091578006744, 0.07095823436975479,
      0.0692959800362587, 0.0571778304874897, 0.03840894624590874,
      0.03992748260498047, 0.044442176818847656, 0.024812698364257812,
      0.01889181137084961, 0.01746807061135769, 0.02140970341861248,
      0.01575336419045925, 0.009525108151137829, 0.016288375481963158,
      0.01498117484152317, 0.011530876159667969, 0.007267284672707319,
      0.005812263581901789, 0.005004978273063898, 0.004055881407111883,
      0.004901885986328125, 0.004685116000473499, 0.0034838677383959293,
    ],
    {},
  ),
];
export const layout = {
  legend: { x: 1, xanchor: "auto", y: 1 },
  margin: { b: 0, l: 0, r: 0, t: 0 },
  sliders: [
    {
      currentvalue: { prefix: "Generation: " },
      len: 1,
      pad: { b: 1, t: 10 },
      steps: [
        {
          args: [
            ["0"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "0",
          method: "animate",
        },
        {
          args: [
            ["1"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "1",
          method: "animate",
        },
        {
          args: [
            ["2"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "2",
          method: "animate",
        },
        {
          args: [
            ["3"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "3",
          method: "animate",
        },
        {
          args: [
            ["4"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "4",
          method: "animate",
        },
        {
          args: [
            ["5"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "5",
          method: "animate",
        },
        {
          args: [
            ["6"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "6",
          method: "animate",
        },
        {
          args: [
            ["7"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "7",
          method: "animate",
        },
        {
          args: [
            ["8"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "8",
          method: "animate",
        },
        {
          args: [
            ["9"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "9",
          method: "animate",
        },
        {
          args: [
            ["10"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "10",
          method: "animate",
        },
        {
          args: [
            ["11"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "11",
          method: "animate",
        },
        {
          args: [
            ["12"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "12",
          method: "animate",
        },
        {
          args: [
            ["13"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "13",
          method: "animate",
        },
        {
          args: [
            ["14"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "14",
          method: "animate",
        },
        {
          args: [
            ["15"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "15",
          method: "animate",
        },
        {
          args: [
            ["16"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "16",
          method: "animate",
        },
        {
          args: [
            ["17"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "17",
          method: "animate",
        },
        {
          args: [
            ["18"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "18",
          method: "animate",
        },
        {
          args: [
            ["19"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "19",
          method: "animate",
        },
        {
          args: [
            ["20"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "20",
          method: "animate",
        },
        {
          args: [
            ["21"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "21",
          method: "animate",
        },
        {
          args: [
            ["22"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "22",
          method: "animate",
        },
        {
          args: [
            ["23"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "23",
          method: "animate",
        },
        {
          args: [
            ["24"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "24",
          method: "animate",
        },
        {
          args: [
            ["25"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "25",
          method: "animate",
        },
        {
          args: [
            ["26"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "26",
          method: "animate",
        },
        {
          args: [
            ["27"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "27",
          method: "animate",
        },
        {
          args: [
            ["28"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "28",
          method: "animate",
        },
        {
          args: [
            ["29"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "29",
          method: "animate",
        },
        {
          args: [
            ["30"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "30",
          method: "animate",
        },
        {
          args: [
            ["31"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "31",
          method: "animate",
        },
        {
          args: [
            ["32"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "32",
          method: "animate",
        },
        {
          args: [
            ["33"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "33",
          method: "animate",
        },
        {
          args: [
            ["34"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "34",
          method: "animate",
        },
        {
          args: [
            ["35"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "35",
          method: "animate",
        },
        {
          args: [
            ["36"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "36",
          method: "animate",
        },
        {
          args: [
            ["37"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "37",
          method: "animate",
        },
        {
          args: [
            ["38"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "38",
          method: "animate",
        },
        {
          args: [
            ["39"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "39",
          method: "animate",
        },
        {
          args: [
            ["40"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "40",
          method: "animate",
        },
        {
          args: [
            ["41"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "41",
          method: "animate",
        },
        {
          args: [
            ["42"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "42",
          method: "animate",
        },
        {
          args: [
            ["43"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "43",
          method: "animate",
        },
        {
          args: [
            ["44"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "44",
          method: "animate",
        },
        {
          args: [
            ["45"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "45",
          method: "animate",
        },
        {
          args: [
            ["46"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "46",
          method: "animate",
        },
        {
          args: [
            ["47"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "47",
          method: "animate",
        },
        {
          args: [
            ["48"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "48",
          method: "animate",
        },
        {
          args: [
            ["49"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "49",
          method: "animate",
        },
        {
          args: [
            ["50"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "50",
          method: "animate",
        },
        {
          args: [
            ["51"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "51",
          method: "animate",
        },
        {
          args: [
            ["52"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "52",
          method: "animate",
        },
        {
          args: [
            ["53"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "53",
          method: "animate",
        },
        {
          args: [
            ["54"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "54",
          method: "animate",
        },
        {
          args: [
            ["55"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "55",
          method: "animate",
        },
        {
          args: [
            ["56"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "56",
          method: "animate",
        },
        {
          args: [
            ["57"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "57",
          method: "animate",
        },
        {
          args: [
            ["58"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "58",
          method: "animate",
        },
        {
          args: [
            ["59"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "59",
          method: "animate",
        },
        {
          args: [
            ["60"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "60",
          method: "animate",
        },
        {
          args: [
            ["61"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "61",
          method: "animate",
        },
        {
          args: [
            ["62"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "62",
          method: "animate",
        },
        {
          args: [
            ["63"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "63",
          method: "animate",
        },
        {
          args: [
            ["64"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "64",
          method: "animate",
        },
        {
          args: [
            ["65"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "65",
          method: "animate",
        },
        {
          args: [
            ["66"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "66",
          method: "animate",
        },
        {
          args: [
            ["67"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "67",
          method: "animate",
        },
        {
          args: [
            ["68"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "68",
          method: "animate",
        },
        {
          args: [
            ["69"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "69",
          method: "animate",
        },
        {
          args: [
            ["70"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "70",
          method: "animate",
        },
        {
          args: [
            ["71"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "71",
          method: "animate",
        },
        {
          args: [
            ["72"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "72",
          method: "animate",
        },
        {
          args: [
            ["73"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "73",
          method: "animate",
        },
        {
          args: [
            ["74"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "74",
          method: "animate",
        },
        {
          args: [
            ["75"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "75",
          method: "animate",
        },
        {
          args: [
            ["76"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "76",
          method: "animate",
        },
        {
          args: [
            ["77"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "77",
          method: "animate",
        },
        {
          args: [
            ["78"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "78",
          method: "animate",
        },
        {
          args: [
            ["79"],
            {
              frame: { duration: 200, redraw: false },
              mode: "immediate",
              transition: { duration: 200 },
            },
          ],
          label: "79",
          method: "animate",
        },
      ],
      x: 0,
      xanchor: "left",
      y: 0,
      yanchor: "top",
    },
  ],
  xaxis: { autorange: false, range: [0, 80] },
  yaxis: { autorange: false, range: [-1.100314736366272, 23.12087631225586] },
  template: {
    data: {
      histogram2dcontour: [
        {
          type: "histogram2dcontour",
          colorbar: { outlinewidth: 0, ticks: "" },
          colorscale: [
            [0, "#0d0887"],
            [0.1111111111111111, "#46039f"],
            [0.2222222222222222, "#7201a8"],
            [0.3333333333333333, "#9c179e"],
            [0.4444444444444444, "#bd3786"],
            [0.5555555555555556, "#d8576b"],
            [0.6666666666666666, "#ed7953"],
            [0.7777777777777778, "#fb9f3a"],
            [0.8888888888888888, "#fdca26"],
            [1, "#f0f921"],
          ],
        },
      ],
      choropleth: [
        { type: "choropleth", colorbar: { outlinewidth: 0, ticks: "" } },
      ],
      histogram2d: [
        {
          type: "histogram2d",
          colorbar: { outlinewidth: 0, ticks: "" },
          colorscale: [
            [0, "#0d0887"],
            [0.1111111111111111, "#46039f"],
            [0.2222222222222222, "#7201a8"],
            [0.3333333333333333, "#9c179e"],
            [0.4444444444444444, "#bd3786"],
            [0.5555555555555556, "#d8576b"],
            [0.6666666666666666, "#ed7953"],
            [0.7777777777777778, "#fb9f3a"],
            [0.8888888888888888, "#fdca26"],
            [1, "#f0f921"],
          ],
        },
      ],
      heatmap: [
        {
          type: "heatmap",
          colorbar: { outlinewidth: 0, ticks: "" },
          colorscale: [
            [0, "#0d0887"],
            [0.1111111111111111, "#46039f"],
            [0.2222222222222222, "#7201a8"],
            [0.3333333333333333, "#9c179e"],
            [0.4444444444444444, "#bd3786"],
            [0.5555555555555556, "#d8576b"],
            [0.6666666666666666, "#ed7953"],
            [0.7777777777777778, "#fb9f3a"],
            [0.8888888888888888, "#fdca26"],
            [1, "#f0f921"],
          ],
        },
      ],
      heatmapgl: [
        {
          type: "heatmapgl",
          colorbar: { outlinewidth: 0, ticks: "" },
          colorscale: [
            [0, "#0d0887"],
            [0.1111111111111111, "#46039f"],
            [0.2222222222222222, "#7201a8"],
            [0.3333333333333333, "#9c179e"],
            [0.4444444444444444, "#bd3786"],
            [0.5555555555555556, "#d8576b"],
            [0.6666666666666666, "#ed7953"],
            [0.7777777777777778, "#fb9f3a"],
            [0.8888888888888888, "#fdca26"],
            [1, "#f0f921"],
          ],
        },
      ],
      contourcarpet: [
        { type: "contourcarpet", colorbar: { outlinewidth: 0, ticks: "" } },
      ],
      contour: [
        {
          type: "contour",
          colorbar: { outlinewidth: 0, ticks: "" },
          colorscale: [
            [0, "#0d0887"],
            [0.1111111111111111, "#46039f"],
            [0.2222222222222222, "#7201a8"],
            [0.3333333333333333, "#9c179e"],
            [0.4444444444444444, "#bd3786"],
            [0.5555555555555556, "#d8576b"],
            [0.6666666666666666, "#ed7953"],
            [0.7777777777777778, "#fb9f3a"],
            [0.8888888888888888, "#fdca26"],
            [1, "#f0f921"],
          ],
        },
      ],
      surface: [
        {
          type: "surface",
          colorbar: { outlinewidth: 0, ticks: "" },
          colorscale: [
            [0, "#0d0887"],
            [0.1111111111111111, "#46039f"],
            [0.2222222222222222, "#7201a8"],
            [0.3333333333333333, "#9c179e"],
            [0.4444444444444444, "#bd3786"],
            [0.5555555555555556, "#d8576b"],
            [0.6666666666666666, "#ed7953"],
            [0.7777777777777778, "#fb9f3a"],
            [0.8888888888888888, "#fdca26"],
            [1, "#f0f921"],
          ],
        },
      ],
      mesh3d: [{ type: "mesh3d", colorbar: { outlinewidth: 0, ticks: "" } }],
      scatter: [
        {
          fillpattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
          type: "scatter",
        },
      ],
      parcoords: [
        {
          type: "parcoords",
          line: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      scatterpolargl: [
        {
          type: "scatterpolargl",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      bar: [
        {
          error_x: { color: "#2a3f5f" },
          error_y: { color: "#2a3f5f" },
          marker: {
            line: { color: "#E5ECF6", width: 0.5 },
            pattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
          },
          type: "bar",
        },
      ],
      scattergeo: [
        {
          type: "scattergeo",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      scatterpolar: [
        {
          type: "scatterpolar",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      histogram: [
        {
          marker: { pattern: { fillmode: "overlay", size: 10, solidity: 0.2 } },
          type: "histogram",
        },
      ],
      scattergl: [
        {
          type: "scattergl",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      scatter3d: [
        {
          type: "scatter3d",
          line: { colorbar: { outlinewidth: 0, ticks: "" } },
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      scattermapbox: [
        {
          type: "scattermapbox",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      scatterternary: [
        {
          type: "scatterternary",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      scattercarpet: [
        {
          type: "scattercarpet",
          marker: { colorbar: { outlinewidth: 0, ticks: "" } },
        },
      ],
      carpet: [
        {
          aaxis: {
            endlinecolor: "#2a3f5f",
            gridcolor: "white",
            linecolor: "white",
            minorgridcolor: "white",
            startlinecolor: "#2a3f5f",
          },
          baxis: {
            endlinecolor: "#2a3f5f",
            gridcolor: "white",
            linecolor: "white",
            minorgridcolor: "white",
            startlinecolor: "#2a3f5f",
          },
          type: "carpet",
        },
      ],
      table: [
        {
          cells: { fill: { color: "#EBF0F8" }, line: { color: "white" } },
          header: { fill: { color: "#C8D4E3" }, line: { color: "white" } },
          type: "table",
        },
      ],
      barpolar: [
        {
          marker: {
            line: { color: "#E5ECF6", width: 0.5 },
            pattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
          },
          type: "barpolar",
        },
      ],
      pie: [{ automargin: true, type: "pie" }],
    },
    layout: {
      autotypenumbers: "strict",
      colorway: [
        "#636efa",
        "#EF553B",
        "#00cc96",
        "#ab63fa",
        "#FFA15A",
        "#19d3f3",
        "#FF6692",
        "#B6E880",
        "#FF97FF",
        "#FECB52",
      ],
      font: { color: "#2a3f5f" },
      hovermode: "closest",
      hoverlabel: { align: "left" },
      paper_bgcolor: "white",
      plot_bgcolor: "#E5ECF6",
      polar: {
        bgcolor: "#E5ECF6",
        angularaxis: { gridcolor: "white", linecolor: "white", ticks: "" },
        radialaxis: { gridcolor: "white", linecolor: "white", ticks: "" },
      },
      ternary: {
        bgcolor: "#E5ECF6",
        aaxis: { gridcolor: "white", linecolor: "white", ticks: "" },
        baxis: { gridcolor: "white", linecolor: "white", ticks: "" },
        caxis: { gridcolor: "white", linecolor: "white", ticks: "" },
      },
      coloraxis: { colorbar: { outlinewidth: 0, ticks: "" } },
      colorscale: {
        sequential: [
          [0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1, "#f0f921"],
        ],
        sequentialminus: [
          [0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1, "#f0f921"],
        ],
        diverging: [
          [0, "#8e0152"],
          [0.1, "#c51b7d"],
          [0.2, "#de77ae"],
          [0.3, "#f1b6da"],
          [0.4, "#fde0ef"],
          [0.5, "#f7f7f7"],
          [0.6, "#e6f5d0"],
          [0.7, "#b8e186"],
          [0.8, "#7fbc41"],
          [0.9, "#4d9221"],
          [1, "#276419"],
        ],
      },
      xaxis: {
        gridcolor: "white",
        linecolor: "white",
        ticks: "",
        title: { standoff: 15 },
        zerolinecolor: "white",
        automargin: true,
        zerolinewidth: 2,
      },
      yaxis: {
        gridcolor: "white",
        linecolor: "white",
        ticks: "",
        title: { standoff: 15 },
        zerolinecolor: "white",
        automargin: true,
        zerolinewidth: 2,
      },
      scene: {
        xaxis: {
          backgroundcolor: "#E5ECF6",
          gridcolor: "white",
          linecolor: "white",
          showbackground: true,
          ticks: "",
          zerolinecolor: "white",
          gridwidth: 2,
        },
        yaxis: {
          backgroundcolor: "#E5ECF6",
          gridcolor: "white",
          linecolor: "white",
          showbackground: true,
          ticks: "",
          zerolinecolor: "white",
          gridwidth: 2,
        },
        zaxis: {
          backgroundcolor: "#E5ECF6",
          gridcolor: "white",
          linecolor: "white",
          showbackground: true,
          ticks: "",
          zerolinecolor: "white",
          gridwidth: 2,
        },
      },
      shapedefaults: { line: { color: "#2a3f5f" } },
      annotationdefaults: {
        arrowcolor: "#2a3f5f",
        arrowhead: 0,
        arrowwidth: 1,
      },
      geo: {
        bgcolor: "white",
        landcolor: "#E5ECF6",
        subunitcolor: "white",
        showland: true,
        showlakes: true,
        lakecolor: "white",
      },
      title: { x: 0.05 },
      mapbox: { style: "light" },
    },
  },
};
