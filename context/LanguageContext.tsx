"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const translations = {
  id: {
    nav: {
      home: 'Beranda',
      projects: 'Proyek',
      services: 'Layanan',
      portfolio: 'Portofolio',
      topup: 'Top Up',
      pricing: 'Harga',
      contact: 'Kontak',
      topup_btn: 'TOP UP SEKARANG'
    },
    hero: {
      status: 'SISTEM ONLINE • AAA DEVELOPMENT AKTIF',
      title1: 'AV GAME',
      title2: 'STUDIO',
      subtitle: 'Membangun Pengalaman Roblox Premium',
      subtitle2: 'Pengembangan Game Generasi Berikutnya • Scripting Profesional • Dunia Imersif',
      explore: 'JELAJAHI PROYEK',
      order: 'PESAN MAP KAMU',
      community: 'GABUNG KOMUNITAS',
      stats: {
        projects: 'Proyek',
        players: 'Pemain',
        satisfaction: 'Kepuasan'
      }
    },
    topup: {
      badge: 'JUAL ROBUX TERPERCAYA',
      title1: 'JUAL ROBUX',
      title2: 'TERMURAH',
      subtitle: 'Top up Robux aman, cepat, dan terpercaya. Harga di bawah ini sudah disesuaikan mengikuti poster promo yang Anda kirim.',
      market_badge: 'ROBUX MARKET',
      market_title: 'Dapatkan Robux-mu sekarang juga',
      market_desc: 'Tinggal pilih nominal, klik order, lalu lanjut chat ke WhatsApp. Flow tetap sederhana, cepat, dan langsung diproses.',
      promo_flow: 'PROMO FLOW',
      promo_title: 'Aman, cepat, dan terpercaya',
      promo_desc: 'Pilih nominal Robux, chat WhatsApp, kirim username Roblox, lalu transaksi langsung diproses tanpa checkout tambahan.',
      stats: {
        fast: 'Proses Cepat',
        fast_val: 'Langsung Masuk',
        safe: 'Aman',
        safe_val: '100% Terpercaya',
        price: 'Harga',
        price_val: 'Termurah',
        fit: 'Cocok',
        fit_val: 'Semua Player'
      },
      etalase_title: 'Etalase Robux',
      etalase_desc: 'Nominal dan harga sudah disamakan dengan desain poster promo yang Anda kirim.',
      ready_stock: 'READY STOCK',
      hot_item: 'HOT ITEM',
      final_price: 'Harga final',
      order_desc: 'Order cepat, kirim username Roblox dan detail pembayaran lewat WhatsApp.',
      order_btn: 'ORDER VIA WA',
      avatar_services: {
        title: 'Avatar Item Services',
        desc: 'Panel kanan dibuat seperti sidebar marketplace berisi jasa tambahan dan informasi transaksi.',
        chat: 'Chat WhatsApp'
      },
      info_transaksi: {
        title: 'INFO TRANSAKSI',
        flow_title: 'Flow tetap langsung ke WhatsApp',
        flow_desc: 'Tidak ada checkout tambahan, jadi lebih cepat untuk closing transaksi.',
        easy_title: 'Order mudah diproses',
        easy_desc: 'User tinggal kirim username Roblox, nominal, dan metode pembayaran.'
      },
      community_check: {
        title: 'Cek Membership Komunitas',
        desc: 'Top up via komunitas mewajibkan Anda sudah bergabung di grup Roblox kami selama minimal 15 hari.',
        join_btn: 'GABUNG GRUP ROBLOX',
        input_placeholder: 'Masukkan Username Roblox...',
        check_btn: 'CEK STATUS',
        checking: 'Mengecek...',
        status_member: 'TERDAFTAR: Anda sudah bisa top up!',
        status_not_member: 'BELUM TERDAFTAR: Silakan gabung grup dulu.',
        status_error: 'Username tidak ditemukan.',
        membership_info: 'Pastikan username benar sesuai di Roblox.'
      }
    },
    featured_maps: {
      badge: 'PROYEK UNGGULAN',
      title1: 'DAFTAR MAP',
      title2: 'AV GAME STUDIO',
      subtitle: 'Jelajahi koleksi pengalaman Roblox kualitas AAA yang dibangun dengan teknologi mutakhir',
      play_now: 'Main Sekarang',
      categories: {
        adventure: 'Eksplorasi Petualangan',
        extreme: 'Petualangan Ekstrem',
        social: 'Nongkrong Sosial',
        fighting: 'Arena Pertarungan',
        farming: 'Simulator Pertanian',
        parkour: 'Tantangan Parkour',
        mystery: 'Horor Misteri'
      },
      status: {
        featured: 'UNGGULAN',
        new: 'BARU',
        popular: 'POPULER',
        live: 'LANGSUNG'
      },
      stats: {
        players: 'Pemain',
        rating: 'Rating'
      },
      maps: [
        { title: 'MOUNT BANDA NEIRA', desc: 'Jelajahi keindahan gunung Banda Neira dengan pemandangan alam yang memukau.' },
        { title: 'MT BANDA NEIRA JALUR EXTREAM', desc: 'Tantangan jalur ekstrem di Banda Neira untuk para petualang sejati.' },
        { title: 'AV NIGHT VIBES', desc: 'Rasakan suasana malam yang aesthetic dengan musik dan lighting keren.' },
        { title: 'AV ARENA', desc: 'Arena pertarungan yang intens dengan sistem combat epic.' },
        { title: 'TEMPAT NONGKRONG', desc: 'Tempat nongkrong santai bareng temen-temen dengan vibes yang asik.' },
        { title: 'MENJADI PETANI', desc: 'Kelola pertanian impianmu, tanam, panen, dan bangun kerajaan pertanian.' },
        { title: 'PARKOUR CITY BLUE', desc: 'Tantangan parkour di kota futuristik dengan obstacle yang menantang.' },
        { title: 'ORANG HILANG', desc: 'Pecahkan misteri orang hilang dalam pengalaman horror yang menegangkan.' }
      ]
    },
    services: {
      badge: 'APA YANG KAMI LAKUKAN',
      title1: 'LAYANAN',
      title2: 'KAMI',
      subtitle: 'Solusi pengembangan game komprehensif yang didukung oleh teknologi mutakhir',
      list: [
        {
          title: 'Pengembangan Map Roblox',
          desc: 'Pembangunan dunia kustom dengan lingkungan imersif, medan mendetail, dan aset yang dioptimalkan untuk gameplay yang lancar.',
          features: ['Desain Dunia', 'Pembuatan Aset', 'Seni Lingkungan']
        },
        {
          title: 'Scripting Lanjutan',
          desc: 'Scripting Lua profesional untuk mekanik game yang kompleks, sistem AI, dan fungsionalitas multipemain.',
          features: ['Logika Game', 'Sistem AI', 'Networking']
        },
        {
          title: 'Sistem Musik DJ',
          desc: 'Sistem audio interaktif dengan soundtrack kustom, musik dinamis, dan desain suara imersif.',
          features: ['Desain Suara', 'Integrasi Musik', 'Efek Audio']
        },
        {
          title: 'Desain UI/UX',
          desc: 'Antarmuka modern dan intuitif dengan animasi halus dan tata letak responsif untuk semua perangkat.',
          features: ['Desain Antarmuka', 'Animasi', 'Siap Mobile']
        },
        {
          title: 'VFX & Pencahayaan',
          desc: 'Efek visual sinematik dan sistem pencahayaan dinamis yang menghidupkan dunia Anda.',
          features: ['Efek Partikel', 'Lampu Dinamis', 'Atmosfer']
        },
        {
          title: 'Optimalisasi',
          desc: 'Penyetelan performa untuk gameplay yang lancar di semua perangkat, dari seluler hingga PC kelas atas.',
          features: ['Boost FPS', 'Opt Memori', 'Waktu Muat']
        },
        {
          title: 'Sistem Komunitas',
          desc: 'Papan peringkat, pencapaian, fitur sosial, dan alat keterlibatan untuk menumbuhkan basis pemain Anda.',
          features: ['Papan Peringkat', 'Pencapaian', 'Sosial']
        }
      ]
    },
    portfolio: {
      badge: 'KARYA KAMI',
      title: 'PORTOFOLIO',
      subtitle: 'Showcase pengalaman Roblox premium dan proyek pengembangan game kami',
      categories: ['Semua', 'Dunia Terbuka', 'Shooter', 'RPG', 'Balapan', 'Survival', 'Sosial'],
      view_project: 'Lihat Proyek',
      items: [
        { title: 'Neon District', desc: 'Pemandangan kota cyberpunk yang luas dengan siklus siang/malam dinamis dan NPC interaktif.' },
        { title: 'Galactic Warfare', desc: 'Game tempur luar angkasa yang menampilkan kapal yang dapat dikustomisasi dan pertempuran armada epik.' },
        { title: 'Shadow Realms', desc: 'RPG fantasi gelap dengan pohon keterampilan, quest, dan dungeon prosedural.' },
        { title: 'Speed Legends', desc: 'Balapan beroktan tinggi dengan mekanik drift dan kustomisasi kendaraan.' },
        { title: 'Apocalypse Rising', desc: 'Survival pasca-apokaliptik dengan pembangunan pangkalan dan elemen PvP.' },
        { title: 'Party Paradise', desc: 'Ruang nongkrong sosial dengan minigame dan avatar yang dapat dikustomisasi.' }
      ]
    },
    pricing: {
      badge: 'HARGA',
      title1: 'PILIH',
      title2: 'PAKETMU',
      subtitle: 'Opsi harga fleksibel untuk setiap ukuran proyek dan anggaran',
      most_popular: 'PALING POPULER',
      per_project: '/ proyek',
      plans: [
        {
          name: 'Starter',
          desc: 'Sangat cocok untuk aset kecil dan proyek mini-map',
          features: ['Desain Map Dasar', 'Scripting Sederhana', 'UI Kit Standar', '3 Revisi', 'Pengiriman 5 Hari', 'Dukungan Dasar']
        },
        {
          name: 'Premium',
          desc: 'Pilihan terbaik untuk pengembangan map game lengkap',
          features: ['Desain Map Lanjutan', 'Scripting Kompleks', 'Custom UI/UX', 'VFX & Pencahayaan', '10 Revisi', 'Pengiriman 10 Hari', 'Dukungan Prioritas', 'File Sumber']
        },
        {
          name: 'Ultimate Studio',
          desc: 'Kualitas AAA profesional untuk proyek besar',
          features: ['Pengembangan Map AAA', 'Sistem AI Lanjutan', 'Desain UI/UX Premium', 'VFX Sinematik', 'Optimalisasi Penuh', 'Revisi Tanpa Batas', 'Pengiriman 21 Hari', 'Dukungan 24/7', 'Kode Sumber Lengkap', 'Aset Pemasaran']
        }
      ]
    },
    community: {
      badge: 'GABUNG SQUAD',
      title1: 'GABUNG',
      title2: 'KOMUNITAS KAMI',
      subtitle: 'Terhubung dengan ribuan gamer, pengembang, dan kreator. Bagikan proyek Anda, dapatkan umpan balik, ikuti turnamen, dan jadilah bagian dari sesuatu yang epik.',
      discord_btn: 'Gabung Server Discord',
      online_status: 'anggota online saat ini',
      stats: {
        members: 'Anggota',
        tournaments: 'Turnamen',
        active: 'Aktif',
        messages: 'Pesan'
      }
    },
    contact: {
      badge: 'HUBUNGI KAMI',
      title1: 'MULAI',
      title2: 'PROYEKMU',
      subtitle: 'Siap untuk mewujudkan visi Anda? Hubungi kami dan mari buat sesuatu yang luar biasa bersama. Tim kami siap membantu.',
      form: {
        name: 'Nama Anda',
        name_placeholder: 'Masukkan nama Anda',
        email: 'Alamat Email',
        email_placeholder: 'anda@email.com',
        project_type: 'Tipe Proyek',
        project_placeholder: 'Pilih tipe proyek',
        details: 'Detail Proyek',
        details_placeholder: 'Ceritakan tentang proyek Anda...',
        submit: 'Kirim Pesan via WhatsApp',
        success: 'Pesan Terkirim!'
      },
      types: ['Pengembangan Map', 'Scripting', 'UI/UX Design', 'Layanan Penuh', 'Konsultasi']
    },
    footer: {
      desc: 'Membangun pengalaman Roblox premium dengan teknologi mutakhir dan kreativitas yang tak tertandingi. Visi Anda, keahlian kami.',
      services: 'LAYANAN',
      company: 'PERUSAHAAN',
      connect: 'HUBUNGI',
      made_with: 'Dibuat dengan',
      for_gamers: 'untuk gamer',
      rights: 'Semua hak dilindungi.'
    },
    robux_packages: [
      {
        name: '100 Robux',
        price: 'Rp 15.000',
        description: 'Pilihan hemat untuk top up kecil, trial buy, atau kebutuhan item ringan.',
        badge: 'FAST',
        meta: 'Proses 5-15 menit',
        stock: 'Ready',
        message: 'Halo AV GAME STUDIO, saya ingin top up 100 Robux dengan harga Rp 15.000. Mohon info proses dan pembayarannya ya.'
      },
      {
        name: '300 Robux',
        price: 'Rp 50.000',
        description: 'Nominal favorit untuk gamepass, UGC basic, dan kebutuhan top up harian.',
        badge: 'BEST SELLER',
        meta: 'Paling sering dipesan',
        stock: 'Ready',
        message: 'Halo AV GAME STUDIO, saya ingin top up 300 Robux dengan harga Rp 50.000. Mohon info proses dan pembayarannya ya.',
        featured: true
      },
      {
        name: '1000 Robux',
        price: 'Rp 150.000',
        description: 'Cocok untuk pembelian item premium, bundle avatar, dan kebutuhan creator.',
        badge: 'SAVE MORE',
        meta: 'Paket hemat besar',
        stock: 'Ready',
        message: 'Halo AV GAME STUDIO, saya ingin top up 1000 Robux dengan harga Rp 150.000. Mohon info proses dan pembayarannya ya.'
      },
      {
        name: '2000 Robux',
        price: 'Rp 290.000',
        description: 'Pilihan terbaik untuk top up skala besar dengan harga lebih bersahabat.',
        badge: 'BIG VALUE',
        meta: 'Untuk player aktif',
        stock: 'Ready',
        message: 'Halo AV GAME STUDIO, saya ingin top up 2000 Robux dengan harga Rp 290.000. Mohon info proses dan pembayarannya ya.'
      }
    ],
    avatar_services: [
      {
        title: 'Pembuatan Jaket Komunitas',
        description: 'Desain dan pembuatan jaket khusus untuk komunitas atau grup Roblox-mu.',
        price: 'Rp 300.000',
        badge: 'PREMIUM',
        message: 'Halo AV GAME STUDIO, saya ingin memesan jasa pembuatan Jaket Komunitas seharga Rp 300.000. Mohon info detailnya ya.'
      },
      {
        title: 'Pembuatan Kaos',
        description: 'Jasa pembuatan kaos (shirt/pants) custom dengan desain unik dan berkualitas.',
        price: 'Rp 350.000',
        badge: 'FAVORITE',
        message: 'Halo AV GAME STUDIO, saya ingin memesan jasa pembuatan Kaos seharga Rp 350.000. Mohon info detailnya ya.'
      },
      {
        title: 'Pembuatan Item Custom',
        description: 'Pembuatan item UGC atau aksesoris custom sesuai dengan keinginanmu.',
        price: 'Rp 500.000',
        badge: 'CUSTOM',
        message: 'Halo AV GAME STUDIO, saya ingin memesan jasa pembuatan Item Custom seharga Rp 500.000. Mohon info detailnya ya.'
      }
    ],
    market_categories: ['Semua', '100 Robux', '300 Robux', '1000 Robux', '2000 Robux']
  },
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      services: 'Services',
      portfolio: 'Portfolio',
      topup: 'Top Up',
      pricing: 'Pricing',
      contact: 'Contact',
      topup_btn: 'TOP UP NOW'
    },
    hero: {
      status: 'SYSTEM ONLINE • AAA DEVELOPMENT ACTIVE',
      title1: 'AV GAME',
      title2: 'STUDIO',
      subtitle: 'Building Premium Roblox Experiences',
      subtitle2: 'Next-Generation Game Development • Professional Scripting • Immersive Worlds',
      explore: 'EXPLORE PROJECTS',
      order: 'ORDER YOUR MAP',
      community: 'JOIN COMMUNITY',
      stats: {
        projects: 'Projects',
        players: 'Players',
        satisfaction: 'Satisfaction'
      }
    },
    topup: {
      badge: 'TRUSTED ROBUX SELLER',
      title1: 'SELL ROBUX',
      title2: 'CHEAPEST',
      subtitle: 'Safe, fast, and trusted Robux top up. The prices below have been adjusted following the promo poster you sent.',
      market_badge: 'ROBUX MARKET',
      market_title: 'Get your Robux right now',
      market_desc: 'Just choose the nominal, click order, then continue chat to WhatsApp. The flow remains simple, fast, and directly processed.',
      promo_flow: 'PROMO FLOW',
      promo_title: 'Safe, fast, and trusted',
      promo_desc: 'Choose Robux nominal, chat WhatsApp, send Roblox username, then transaction is directly processed without additional checkout.',
      stats: {
        fast: 'Fast Process',
        fast_val: 'Instant In',
        safe: 'Safe',
        safe_val: '100% Trusted',
        price: 'Price',
        price_val: 'Cheapest',
        fit: 'Fit',
        fit_val: 'All Players'
      },
      etalase_title: 'Robux Showcase',
      etalase_desc: 'Nominals and prices have been matched with the promo poster design you sent.',
      ready_stock: 'READY STOCK',
      hot_item: 'HOT ITEM',
      final_price: 'Final price',
      order_desc: 'Fast order, send Roblox username and payment details via WhatsApp.',
      order_btn: 'ORDER VIA WA',
      avatar_services: {
        title: 'Avatar Item Services',
        desc: 'Right panel is made like a marketplace sidebar containing additional services and transaction information.',
        chat: 'Chat WhatsApp'
      },
      info_transaksi: {
        title: 'TRANSACTION INFO',
        flow_title: 'Flow stays directly to WhatsApp',
        flow_desc: 'No additional checkout, so it\'s faster to close transactions.',
        easy_title: 'Order easy to process',
        easy_desc: 'User just needs to send Roblox username, nominal, and payment method.'
      },
      community_check: {
        title: 'Community Membership Check',
        desc: 'Top up via community requires you to be a member of our Roblox group for at least 15 days.',
        join_btn: 'JOIN ROBLOX GROUP',
        input_placeholder: 'Enter Roblox Username...',
        check_btn: 'CHECK STATUS',
        checking: 'Checking...',
        status_member: 'REGISTERED: You can top up now!',
        status_not_member: 'NOT REGISTERED: Please join the group first.',
        status_error: 'Username not found.',
        membership_info: 'Make sure the username matches your Roblox name.'
      }
    },
    featured_maps: {
      badge: 'FEATURED PROJECTS',
      title1: 'AV GAME STUDIO',
      title2: 'MAP LIST',
      subtitle: 'Explore our collection of AAA-quality Roblox experiences built with cutting-edge technology',
      play_now: 'Play Now',
      categories: {
        adventure: 'Adventure Exploration',
        extreme: 'Extreme Adventure',
        social: 'Social Hangout',
        fighting: 'Fighting Arena',
        farming: 'Farming Simulator',
        parkour: 'Parkour Challenge',
        mystery: 'Mystery Horror'
      },
      status: {
        featured: 'FEATURED',
        new: 'NEW',
        popular: 'POPULAR',
        live: 'LIVE'
      },
      stats: {
        players: 'Players',
        rating: 'Rating'
      },
      maps: [
        { title: 'MOUNT BANDA NEIRA', desc: 'Explore the beauty of Mount Banda Neira with stunning natural scenery.' },
        { title: 'MT BANDA NEIRA JALUR EXTREAM', desc: 'Extreme trail challenges in Banda Neira for true adventurers.' },
        { title: 'AV NIGHT VIBES', desc: 'Experience the aesthetic night atmosphere with cool music and lighting.' },
        { title: 'AV ARENA', desc: 'Intense fighting arena with an epic combat system.' },
        { title: 'TEMPAT NONGKRONG', desc: 'Relaxing hangout place with friends with cool vibes.' },
        { title: 'MENJADI PETANI', desc: 'Manage your dream farm, plant, harvest, and build a farming empire.' },
        { title: 'PARKOUR CITY BLUE', desc: 'Parkour challenges in a futuristic city with challenging obstacles.' },
        { title: 'ORANG HILANG', desc: 'Solve the mystery of missing people in a tense horror experience.' }
      ]
    },
    services: {
      badge: 'WHAT WE DO',
      title1: 'OUR',
      title2: 'SERVICES',
      subtitle: 'Comprehensive game development solutions powered by cutting-edge technology',
      list: [
        {
          title: 'Roblox Map Development',
          desc: 'Custom world building with immersive environments, detailed terrain, and optimized assets for seamless gameplay.',
          features: ['World Design', 'Asset Creation', 'Environment Art']
        },
        {
          title: 'Advanced Scripting',
          desc: 'Professional Lua scripting for complex game mechanics, AI systems, and multiplayer functionality.',
          features: ['Game Logic', 'AI Systems', 'Networking']
        },
        {
          title: 'DJ Music Systems',
          desc: 'Interactive audio systems with custom soundtracks, dynamic music, and immersive sound design.',
          features: ['Sound Design', 'Music Integration', 'Audio FX']
        },
        {
          title: 'UI/UX Design',
          desc: 'Modern, intuitive interfaces with smooth animations and responsive layouts for all devices.',
          features: ['Interface Design', 'Animation', 'Mobile Ready']
        },
        {
          title: 'VFX & Lighting',
          desc: 'Cinematic visual effects and dynamic lighting systems that bring your world to life.',
          features: ['Particle FX', 'Dynamic Lights', 'Atmosphere']
        },
        {
          title: 'Optimization',
          desc: 'Performance tuning for smooth gameplay on all devices, from mobile to high-end PCs.',
          features: ['FPS Boost', 'Memory Opt', 'Load Times']
        },
        {
          title: 'Community Systems',
          desc: 'Leaderboards, achievements, social features, and engagement tools to grow your player base.',
          features: ['Leaderboards', 'Achievements', 'Social']
        }
      ]
    },
    portfolio: {
      badge: 'OUR WORK',
      title: 'PORTFOLIO',
      subtitle: 'Showcase of our premium Roblox experiences and game development projects',
      categories: ['All', 'Open World', 'Shooter', 'RPG', 'Racing', 'Survival', 'Social'],
      view_project: 'View Project',
      items: [
        { title: 'Neon District', desc: 'A sprawling cyberpunk cityscape with dynamic day/night cycles and interactive NPCs.' },
        { title: 'Galactic Warfare', desc: 'Space combat game featuring customizable ships and epic fleet battles.' },
        { title: 'Shadow Realms', desc: 'Dark fantasy RPG with skill trees, quests, and procedural dungeons.' },
        { title: 'Speed Legends', desc: 'High-octane racing with drift mechanics and vehicle customization.' },
        { title: 'Apocalypse Rising', desc: 'Post-apocalyptic survival with base building and PvP elements.' },
        { title: 'Party Paradise', desc: 'Social hangout space with minigames and customizable avatars.' }
      ]
    },
    pricing: {
      badge: 'PRICING',
      title1: 'CHOOSE YOUR',
      title2: 'PLAN',
      subtitle: 'Flexible pricing options for every project size and budget',
      most_popular: 'MOST POPULAR',
      per_project: '/ project',
      plans: [
        {
          name: 'Starter',
          desc: 'Perfect for small assets and mini-map projects',
          features: ['Basic Map Design', 'Simple Scripting', 'Standard UI Kit', '3 Revisions', '5 Day Delivery', 'Basic Support']
        },
        {
          name: 'Premium',
          desc: 'The sweet spot for full game map development',
          features: ['Advanced Map Design', 'Complex Scripting', 'Custom UI/UX', 'VFX & Lighting', '10 Revisions', '10 Day Delivery', 'Priority Support', 'Source Files']
        },
        {
          name: 'Ultimate Studio',
          desc: 'Professional AAA quality for major projects',
          features: ['AAA Map Development', 'Advanced AI Systems', 'Premium UI/UX Design', 'Cinematic VFX', 'Full Optimization', 'Unlimited Revisions', '21 Day Delivery', '24/7 Support', 'Full Source Code', 'Marketing Assets']
        }
      ]
    },
    community: {
      badge: 'JOIN THE SQUAD',
      title1: 'JOIN OUR',
      title2: 'COMMUNITY',
      subtitle: 'Connect with thousands of gamers, developers, and creators. Share your projects, get feedback, participate in tournaments, and be part of something epic.',
      discord_btn: 'Join Discord Server',
      online_status: 'members online right now',
      stats: {
        members: 'Members',
        tournaments: 'Tournaments',
        active: 'Active',
        messages: 'Messages'
      }
    },
    contact: {
      badge: 'GET IN TOUCH',
      title1: 'START YOUR',
      title2: 'PROJECT',
      subtitle: 'Ready to bring your vision to life? Contact us and let\'s create something extraordinary together. Our team is ready to help.',
      form: {
        name: 'Your Name',
        name_placeholder: 'Enter your name',
        email: 'Email Address',
        email_placeholder: 'your@email.com',
        project_type: 'Project Type',
        project_placeholder: 'Select project type',
        details: 'Project Details',
        details_placeholder: 'Tell us about your project...',
        submit: 'Send Message via WhatsApp',
        success: 'Message Sent!'
      },
      types: ['Map Development', 'Scripting', 'UI/UX Design', 'Full Service', 'Consultation']
    },
    footer: {
      desc: 'Building premium Roblox experiences with cutting-edge technology and unmatched creativity. Your vision, our expertise.',
      services: 'SERVICES',
      company: 'COMPANY',
      connect: 'CONNECT',
      made_with: 'Made with',
      for_gamers: 'for gamers',
      rights: 'All rights reserved.'
    },
    robux_packages: [
      {
        name: '100 Robux',
        price: 'Rp 15.000',
        description: 'Budget-friendly choice for small top ups, trial buys, or light item needs.',
        badge: 'FAST',
        meta: '5-15 mins process',
        stock: 'Ready',
        message: 'Hello AV GAME STUDIO, I would like to top up 100 Robux for Rp 15.000. Please info about the process and payment.'
      },
      {
        name: '300 Robux',
        price: 'Rp 50.000',
        description: 'Favorite nominal for gamepasses, basic UGC, and daily top up needs.',
        badge: 'BEST SELLER',
        meta: 'Most frequently ordered',
        stock: 'Ready',
        message: 'Hello AV GAME STUDIO, I would like to top up 300 Robux for Rp 50.000. Please info about the process and payment.',
        featured: true
      },
      {
        name: '1000 Robux',
        price: 'Rp 150.000',
        description: 'Suitable for premium item purchases, avatar bundles, and creator needs.',
        badge: 'SAVE MORE',
        meta: 'Big savings pack',
        stock: 'Ready',
        message: 'Hello AV GAME STUDIO, I would like to top up 1000 Robux for Rp 150.000. Please info about the process and payment.'
      },
      {
        name: '2000 Robux',
        price: 'Rp 290.000',
        description: 'Best choice for large-scale top up with friendlier prices.',
        badge: 'BIG VALUE',
        meta: 'For active players',
        stock: 'Ready',
        message: 'Hello AV GAME STUDIO, I would like to top up 2000 Robux for Rp 290.000. Please info about the process and payment.'
      }
    ],
    avatar_services: [
      {
        title: 'Community Jacket Creation',
        description: 'Design and creation of custom jackets for your Roblox community or group.',
        price: 'Rp 300.000',
        badge: 'PREMIUM',
        message: 'Hello AV GAME STUDIO, I would like to order Community Jacket creation service for Rp 300.000. Please info for details.'
      },
      {
        title: 'Shirt Creation',
        description: 'Custom shirt/pants creation service with unique and high-quality designs.',
        price: 'Rp 350.000',
        badge: 'FAVORITE',
        message: 'Hello AV GAME STUDIO, I would like to order Shirt creation service for Rp 350.000. Please info for details.'
      },
      {
        title: 'Custom Item Creation',
        description: 'UGC item or custom accessory creation according to your wishes.',
        price: 'Rp 500.000',
        badge: 'CUSTOM',
        message: 'Hello AV GAME STUDIO, I would like to order Custom Item creation service for Rp 500.000. Please info for details.'
      }
    ],
    market_categories: ['All', '100 Robux', '300 Robux', '1000 Robux', '2000 Robux']
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[language];
    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key];
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
