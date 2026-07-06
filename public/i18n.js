/**
 * All survey content in English (en) and Kinyarwanda (rw).
 *
 * Option `value`s are stable English slugs so that data analysis and the
 * admin dashboard aggregate answers across both languages.
 */
window.SURVEY = {
  ui: {
    en: {
      brand: 'iSoko Rwanda',
      title: 'Help us build iSoko',
      intro:
        'iSoko is a new platform that will let you find real shops near you, see what they have in stock, order, and pay — all from your phone. Before we build it, we want to hear from you. This takes about 3 minutes.',
      chooseLanguage: 'Choose your language',
      whoAreYou: 'Which best describes you?',
      customer: 'I am a customer',
      customerHint: 'I buy from local shops',
      shopOwner: 'I am a shop owner',
      shopOwnerHint: 'I run a shop or sell products/services',
      next: 'Next',
      back: 'Back',
      submit: 'Submit',
      start: 'Start the survey',
      skip: 'Skip',
      optional: '(optional)',
      required: 'Please answer this question to continue.',
      chooseAll: 'Choose all that apply',
      contactTitle: 'Almost done!',
      contactIntro:
        'Leave your details if you would like early access to iSoko. This is completely optional — you can submit without it.',
      nameLabel: 'Your name',
      phoneLabel: 'Phone number',
      districtLabel: 'District / neighborhood',
      contactOk: 'You may contact me about iSoko updates and early access',
      thanksTitle: 'Murakoze — Thank you!',
      thanksBody:
        'Your feedback will directly shape how we build iSoko for shops and customers across Rwanda.',
      submitAnother: 'Submit another response',
      submitError: 'Something went wrong sending your answers. Please try again.',
      textPlaceholder: 'Type your answer here…',
      stepOf: (i, n) => `Question ${i} of ${n}`,
    },
    rw: {
      brand: 'iSoko Rwanda',
      title: 'Dufashe kubaka iSoko',
      intro:
        'iSoko ni urubuga rushya ruzagufasha kubona amaduka ari hafi yawe, kureba ibicuruzwa afite n\u2019ibiciro byabyo, gutumiza no kwishyura — byose ukoresheje telefoni yawe. Mbere yo kuyubaka, twifuza kumva igitekerezo cyawe. Bifata iminota igera kuri 3.',
      chooseLanguage: 'Hitamo ururimi',
      whoAreYou: 'Ni ikihe kikuranga neza?',
      customer: 'Ndi umuguzi',
      customerHint: 'Ngura mu maduka yo hafi yanjye',
      shopOwner: 'Ndi umucuruzi',
      shopOwnerHint: 'Mfite iduka cyangwa ngurisha ibicuruzwa/serivisi',
      next: 'Komeza',
      back: 'Subira inyuma',
      submit: 'Ohereza',
      start: 'Tangira ubushakashatsi',
      skip: 'Simbuka',
      optional: '(si itegeko)',
      required: 'Subiza iki kibazo kugira ngo ukomeze.',
      chooseAll: 'Hitamo byose bikureba',
      contactTitle: 'Hafi kurangiza!',
      contactIntro:
        'Siga amakuru yawe niba wifuza kugeragereza iSoko hakiri kare. Ibi si itegeko — ushobora kohereza utabyujuje.',
      nameLabel: 'Izina ryawe',
      phoneLabel: 'Numero ya telefoni',
      districtLabel: 'Akarere / aho utuye',
      contactOk: 'Mushobora kumenyesha amakuru ya iSoko no kuyigeragezaho hakiri kare',
      thanksTitle: 'Murakoze cyane!',
      thanksBody:
        'Igitekerezo cyawe kizadufasha kubaka iSoko ku buryo bunogeye abacuruzi n\u2019abaguzi mu Rwanda.',
      submitAnother: 'Ohereza ikindi gisubizo',
      submitError: 'Habaye ikibazo mu kohereza ibisubizo byawe. Ongera ugerageze.',
      textPlaceholder: 'Andika igisubizo cyawe hano…',
      stepOf: (i, n) => `Ikibazo ${i} muri ${n}`,
    },
  },

  questions: {
    customer: [
      {
        id: 'shop_frequency',
        type: 'single',
        required: true,
        label: {
          en: 'How often do you buy from local shops?',
          rw: 'Ni kangahe ugura mu maduka yo hafi yawe?',
        },
        options: [
          { value: 'Every day', label: { en: 'Every day', rw: 'Buri munsi' } },
          { value: 'A few times a week', label: { en: 'A few times a week', rw: 'Inshuro nke mu cyumweru' } },
          { value: 'A few times a month', label: { en: 'A few times a month', rw: 'Inshuro nke mu kwezi' } },
          { value: 'Rarely', label: { en: 'Rarely', rw: 'Gake cyane' } },
        ],
      },
      {
        id: 'frustrations',
        type: 'multi',
        required: true,
        label: {
          en: 'What frustrates you most when buying from shops?',
          rw: 'Ni iki kikugora cyane iyo ugura mu maduka?',
        },
        options: [
          {
            value: "Don't know what's in stock before going",
            label: {
              en: "I don't know what's in stock before I go",
              rw: 'Simenya ibihari mu iduka mbere yo kujyayo',
            },
          },
          {
            value: 'Transport time and cost',
            label: { en: 'Transport time and cost', rw: 'Igihe n\u2019amafaranga y\u2019urugendo' },
          },
          {
            value: 'Hard to compare prices',
            label: { en: 'Comparing prices is hard', rw: 'Kugereranya ibiciro biragoye' },
          },
          {
            value: "Can't pay remotely with trust",
            label: {
              en: "I can't pay remotely and trust the order will be honored",
              rw: 'Sinshobora kwishyura ndi kure nizeye ko ibyo naguze bizanzanirwa',
            },
          },
          {
            value: 'Hard to find shops selling what I need',
            label: {
              en: 'Hard to find shops that sell what I need',
              rw: 'Biragoye kubona amaduka agurisha ibyo nkeneye',
            },
          },
        ],
      },
      {
        id: 'wasted_trip',
        type: 'single',
        required: true,
        label: {
          en: "Have you ever traveled to a shop only to find they didn't have what you needed?",
          rw: 'Wigeze ujya ku iduka ugasanga nta cyo wifuzaga bafite?',
        },
        options: [
          { value: 'Often', label: { en: 'Yes, often', rw: 'Yego, kenshi' } },
          { value: 'Sometimes', label: { en: 'Sometimes', rw: 'Rimwe na rimwe' } },
          { value: 'Never', label: { en: 'Never', rw: 'Nta na rimwe' } },
        ],
      },
      {
        id: 'would_use_app',
        type: 'single',
        required: true,
        label: {
          en: 'Would you use an app to see what nearby shops have in stock — with prices — before leaving home?',
          rw: 'Wakoresha porogaramu (app) ikwereka ibiri mu maduka yo hafi yawe n\u2019ibiciro byabyo utaravuye mu rugo?',
        },
        options: [
          { value: 'Yes, definitely', label: { en: 'Yes, definitely', rw: 'Yego, rwose' } },
          { value: 'Maybe', label: { en: 'Maybe', rw: 'Birashoboka' } },
          { value: 'No', label: { en: 'No', rw: 'Oya' } },
        ],
      },
      {
        id: 'momo_pay',
        type: 'single',
        required: true,
        label: {
          en: 'Would you pay for orders using Mobile Money inside the app?',
          rw: 'Wakwishyura ibyo waguze ukoresheje Mobile Money muri iyo porogaramu?',
        },
        options: [
          { value: 'Yes', label: { en: 'Yes', rw: 'Yego' } },
          { value: 'Prefer cash', label: { en: 'I prefer cash', rw: 'Nkunda kwishyura mu ntoki' } },
          { value: 'Depends on the shop', label: { en: 'Depends on the shop', rw: 'Biterwa n\u2019iduka' } },
        ],
      },
      {
        id: 'categories',
        type: 'multi',
        required: true,
        label: {
          en: 'What would you most like to order from home?',
          rw: 'Ni ibihe bintu wifuza kugura utavuye mu rugo?',
        },
        options: [
          {
            value: 'Groceries & food',
            label: { en: 'Groceries & food', rw: 'Ibiribwa n\u2019ibikoresho byo mu rugo' },
          },
          {
            value: 'Pharmacy & health',
            label: { en: 'Pharmacy & health', rw: 'Imiti n\u2019ibijyanye n\u2019ubuzima' },
          },
          {
            value: 'Phones & electronics',
            label: { en: 'Phones & electronics', rw: 'Telefoni n\u2019ibikoresho by\u2019ikoranabuhanga' },
          },
          { value: 'Clothing & fashion', label: { en: 'Clothing & fashion', rw: 'Imyenda n\u2019imideli' } },
          {
            value: 'Services (salon, repairs, ...)',
            label: { en: 'Services (salon, repairs, …)', rw: 'Serivisi (salon, gukanika, …)' },
          },
          { value: 'Other', label: { en: 'Other', rw: 'Ibindi' } },
        ],
      },
      {
        id: 'delivery_pref',
        type: 'single',
        required: true,
        label: {
          en: 'How would you prefer to receive your orders?',
          rw: 'Wifuza kubona ibyo waguze gute?',
        },
        options: [
          { value: 'Delivered to me', label: { en: 'Delivered to me', rw: 'Binzanirwe aho ndi' } },
          { value: 'Pickup at the shop', label: { en: 'I pick up at the shop', rw: 'Njye kubifata ku iduka' } },
          { value: 'Depends', label: { en: 'Depends on the order', rw: 'Biterwa n\u2019icyo naguze' } },
        ],
      },
      {
        id: 'phone_access',
        type: 'single',
        required: true,
        label: { en: 'What phone do you use?', rw: 'Ukoresha telefoni ki?' },
        options: [
          {
            value: 'Smartphone with internet',
            label: { en: 'Smartphone with internet', rw: 'Smartphone ifite interineti' },
          },
          {
            value: 'Smartphone, limited data',
            label: { en: 'Smartphone, but limited data', rw: 'Smartphone ariko interineti ni nke' },
          },
          { value: 'Basic phone', label: { en: 'Basic phone', rw: 'Telefoni isanzwe' } },
        ],
      },
      {
        id: 'trust_text',
        type: 'text',
        required: false,
        label: {
          en: "What would make you trust ordering from a shop you've never visited?",
          rw: 'Ni iki cyatuma wizera kugura ku iduka utigeze ujyaho?',
        },
      },
      {
        id: 'customer_suggestions',
        type: 'text',
        required: false,
        label: {
          en: 'Anything else you would like this platform to do for you?',
          rw: 'Hari ikindi wifuza ko iyi porogaramu yagufasha?',
        },
      },
    ],

    shop_owner: [
      {
        id: 'shop_category',
        type: 'single',
        required: true,
        label: {
          en: 'What type of shop or business do you run?',
          rw: 'Ukora ubuhe bwoko bw\u2019ubucuruzi?',
        },
        options: [
          {
            value: 'General shop / boutique',
            label: { en: 'General shop / boutique', rw: 'Iduka rusange (butike)' },
          },
          { value: 'Food & groceries', label: { en: 'Food & groceries', rw: 'Ibiribwa' } },
          { value: 'Pharmacy / health', label: { en: 'Pharmacy / health', rw: 'Farumasi / ubuzima' } },
          {
            value: 'Phones & electronics',
            label: { en: 'Phones & electronics', rw: 'Telefoni n\u2019ikoranabuhanga' },
          },
          { value: 'Clothing & fashion', label: { en: 'Clothing & fashion', rw: 'Imyenda n\u2019imideli' } },
          {
            value: 'Services (salon, repairs, ...)',
            label: { en: 'Services (salon, repairs, …)', rw: 'Serivisi (salon, gukanika, …)' },
          },
          { value: 'Other', label: { en: 'Other', rw: 'Ubundi' } },
        ],
      },
      {
        id: 'find_customers',
        type: 'multi',
        required: true,
        label: {
          en: 'How do new customers find your shop today?',
          rw: 'Abakiriya bashya babona bate iduka ryawe ubu?',
        },
        options: [
          {
            value: 'Walk past and see it',
            label: { en: 'They walk past and see it', rw: 'Baba banyura hafi bakaribona' },
          },
          { value: 'Word of mouth', label: { en: 'Word of mouth', rw: 'Abandi barababwira' } },
          {
            value: 'WhatsApp / social media',
            label: { en: 'WhatsApp / social media', rw: 'WhatsApp / imbuga nkoranyambaga' },
          },
          {
            value: 'Calls from regular customers',
            label: { en: 'Phone calls from regular customers', rw: 'Abakiriya basanzwe barampamagara' },
          },
          { value: 'Other', label: { en: 'Other', rw: 'Ubundi buryo' } },
        ],
      },
      {
        id: 'biggest_challenge',
        type: 'multi',
        required: true,
        label: {
          en: 'What are your biggest challenges as a shop owner?',
          rw: 'Ni izihe mbogamizi zikomeye uhura nazo mu bucuruzi bwawe?',
        },
        options: [
          {
            value: 'Not enough new customers',
            label: { en: 'Not enough new customers', rw: 'Abakiriya bashya ni bake' },
          },
          {
            value: "Customers don't know my stock",
            label: {
              en: "Customers don't know what I have in stock",
              rw: 'Abakiriya ntibamenya ibicuruzwa mfite',
            },
          },
          {
            value: 'Taking payments remotely',
            label: { en: 'Taking payments from customers who are far away', rw: 'Kwakira ubwishyu bw\u2019abakiriya bari kure' },
          },
          {
            value: 'Managing orders and deliveries',
            label: {
              en: 'Managing orders and deliveries',
              rw: 'Gucunga ibyatumijwe no kubigeza ku bakiriya',
            },
          },
          { value: 'Other', label: { en: 'Other', rw: 'Izindi' } },
        ],
      },
      {
        id: 'would_list',
        type: 'single',
        required: true,
        label: {
          en: 'Would you list your shop and products for free on a platform where nearby customers can find you on a map?',
          rw: 'Wakwandikisha iduka ryawe n\u2019ibicuruzwa byawe ku buntu kuri porogaramu ituma abakiriya bo hafi yawe bakubona ku ikarita?',
        },
        options: [
          { value: 'Yes, definitely', label: { en: 'Yes, definitely', rw: 'Yego, rwose' } },
          {
            value: 'Maybe, need to know more',
            label: { en: 'Maybe — I need to know more', rw: 'Birashoboka — nkeneye kubanza kumenya byinshi' },
          },
          { value: 'No', label: { en: 'No', rw: 'Oya' } },
        ],
      },
      {
        id: 'fee_fair',
        type: 'single',
        required: true,
        label: {
          en: 'iSoko would take a small fee (3–5%) only from completed orders — listing stays free. Does that seem fair?',
          rw: 'iSoko yajya ifata umusanzu muto (3–5%) gusa ku byagurishijwe — kwandikisha iduka bigakomeza kuba ubuntu. Ese ubona ari byiza?',
        },
        options: [
          { value: "Yes, that's fair", label: { en: "Yes, that's fair", rw: 'Yego, ni byiza' } },
          { value: 'Too high', label: { en: "It's too high", rw: 'Ni menshi cyane' } },
          {
            value: 'Depends on customers gained',
            label: {
              en: 'Depends on how many customers it brings me',
              rw: 'Biterwa n\u2019umubare w\u2019abakiriya izanzanira',
            },
          },
          { value: 'Not sure', label: { en: 'Not sure', rw: 'Simbizi neza' } },
        ],
      },
      {
        id: 'premium_sub',
        type: 'single',
        required: true,
        label: {
          en: 'Would you pay 10,000–20,000 RWF/month for top placement in search results and on the map?',
          rw: 'Wakwishyura 10.000–20.000 RWF ku kwezi kugira ngo iduka ryawe rigaragare mbere y\u2019ayandi mu ishakisha no ku ikarita?',
        },
        options: [
          { value: 'Yes', label: { en: 'Yes', rw: 'Yego' } },
          {
            value: 'Maybe later, once I see results',
            label: { en: 'Maybe later, once I see results', rw: 'Wenda nyuma, nimara kubona inyungu' },
          },
          { value: 'No', label: { en: 'No', rw: 'Oya' } },
        ],
      },
      {
        id: 'momo_accept',
        type: 'single',
        required: true,
        label: {
          en: 'Do you accept Mobile Money payments today?',
          rw: 'Ese wakira ubwishyu bwa Mobile Money ubu?',
        },
        options: [
          { value: 'Yes', label: { en: 'Yes', rw: 'Yego' } },
          { value: 'No', label: { en: 'No', rw: 'Oya' } },
          { value: 'Planning to', label: { en: 'Planning to', rw: 'Ndabitegura' } },
        ],
      },
      {
        id: 'daily_orders',
        type: 'single',
        required: true,
        label: {
          en: 'Roughly how many sales do you make per day?',
          rw: 'Ugereranyije, ugurisha inshuro zingahe ku munsi?',
        },
        options: [
          { value: 'Fewer than 5', label: { en: 'Fewer than 5', rw: 'Munsi ya 5' } },
          { value: '5-20', label: { en: '5–20', rw: '5–20' } },
          { value: '21-50', label: { en: '21–50', rw: '21–50' } },
          { value: 'More than 50', label: { en: 'More than 50', rw: 'Hejuru ya 50' } },
        ],
      },
      {
        id: 'best_feature',
        type: 'text',
        required: false,
        label: {
          en: 'What one feature would help your shop the most?',
          rw: 'Ni iki kintu kimwe cyafasha iduka ryawe kurusha ibindi?',
        },
      },
      {
        id: 'owner_concerns',
        type: 'text',
        required: false,
        label: {
          en: 'Any concerns about joining a platform like iSoko?',
          rw: 'Hari impungenge waba ufite zo kwinjira kuri porogaramu nka iSoko?',
        },
      },
    ],
  },
};
