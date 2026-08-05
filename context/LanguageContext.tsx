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
      gallery: 'Galeri',
      assets: 'Aset',
      topup: 'Top Up Robux',
      topgame: 'Top Up Game',
      pricing: 'Harga',
      contact: 'Kontak',
      topup_btn: 'TOP UP SEKARANG'
    },
    hero: {
      status: 'AV STUDIO • SIAP MEMBANGUN PROYEK IMPIANMU',
      title1: 'AV GAME',
      title2: 'STUDIO',
      subtitle: 'Membangun Pengalaman Roblox Premium',
      subtitle2: 'Wujudkan Ide Game Anda Bersama Ahli Pengembangan Roblox',
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
      badge: 'LAYANAN TOP UP TERPERCAYA',
      title1: 'TOP UP',
      title2: 'ROBUX',
      subtitle: 'Layanan pengisian Robux aman dan efisien. Harga kompetitif dengan sistem pengiriman diproses admin.',
      market_badge: 'ROBUX MARKET',
      market_title: 'Dapatkan Robux Secara Instan',
      market_desc: 'Pilih nominal yang Anda butuhkan dan selesaikan transaksi melalui sistem pembayaran kami.',
      search_placeholder: 'Cari nominal atau paket...',
      promo_flow: 'ALUR TRANSAKSI',
      promo_title: 'Aman, Cepat, & Transparan',
      promo_desc: 'Proses pemesanan mudah untuk kenyamanan Anda. Pilih, bayar, dan klaim Robux via WhatsApp.',
      stats: {
        fast: 'Layanan Kilat',
        fast_val: 'Proses Cepat',
        safe: 'Terjamin',
        safe_val: '100% Keamanan',
        price: 'Efisiensi',
        price_val: 'Harga Terbaik',
        fit: 'Fleksibel',
        fit_val: 'Semua Kebutuhan'
      },
      etalase_title: 'Katalog Robux',
      etalase_desc: 'Pilihan paket Robux yang dikurasi khusus untuk memenuhi kebutuhan gaming Anda.',
      ready_stock: 'STOK TERSEDIA',
      hot_item: 'PILIHAN UTAMA',
      tab_robux: 'Top Up Robux',
      tab_games: 'Top Up Games',
      final_price: 'Harga Final',
      order_desc: 'Selesaikan pesanan Anda dengan memasukkan username dan melakukan pembayaran.',
      order_btn: 'BELI SEKARANG',
      avatar_services: {
        title: 'Layanan Item Avatar',
        desc: 'Tingkatkan identitas visual karakter Anda dengan aset kustom berkualitas tinggi.',
        chat: 'Konsultasi Sekarang'
      },
      info_transaksi: {
        title: 'PANDUAN TRANSAKSI',
        flow_title: 'Sistem Pembayaran Terintegrasi',
        flow_desc: 'Integrasi Midtrans memungkinkan setiap pesanan terkonfirmasi secara instan untuk segera diproses admin.',
        easy_title: 'Kemudahan Pemesanan',
        easy_desc: 'Cukup masukkan username Roblox Anda, pilih paket, selesaikan pembayaran, dan klaim via WA.'
      },
      community_check: {
        title: 'Verifikasi Anggota Komunitas',
        desc: 'Layanan khusus anggota komunitas. Pastikan Anda telah bergabung dalam grup resmi kami.',
        join_btn: 'GABUNG GRUP ROBLOX',
        input_placeholder: 'Masukkan Username Roblox Anda...',
        check_btn: 'VERIFIKASI STATUS',
        checking: 'Memproses...',
        status_member: 'TERVERIFIKASI: Layanan dapat diakses.',
        status_not_member: 'BELUM TERDAFTAR: Silakan bergabung dengan grup terlebih dahulu.',
        status_error: 'Identitas tidak ditemukan.',
        membership_info: 'Pastikan username sesuai dengan data profil Roblox Anda.',
        realtime_stock: 'Stok Real-time Grup'
      }
    },
    featured_maps: {
      badge: 'PROYEK UNGGULAN',
      title1: 'PORTOFOLIO',
      title2: 'PENGALAMAN',
      subtitle: 'Koleksi dunia virtual premium yang dikembangkan dengan standar kualitas industri',
      play_now: 'Mainkan Sekarang',
      categories: {
        adventure: 'Eksplorasi Dunia',
        extreme: 'Tantangan Ekstrem',
        social: 'Interaksi Sosial',
        fighting: 'Arena Kompetitif',
        farming: 'Simulator Ekonomi',
        parkour: 'Ketangkasan Fisik',
        mystery: 'Narasi & Misteri'
      },
      status: {
        featured: 'UNGGULAN',
        new: 'BARU',
        popular: 'POPULER',
        live: 'AKTIF'
      },
      stats: {
        players: 'Pemain Aktif',
        rating: 'Rating Komunitas'
      },
      maps: [
        { title: 'MOUNT BANDA NEIRA', desc: 'Eksplorasi keindahan alam yang megah dengan visual yang memukau.' },
        { title: 'MT BANDA NEIRA JALUR EXTREAM', desc: 'Uji batas kemampuan Anda dalam medan paling menantang.' },
        { title: 'NIGHT VIBES', desc: 'Suasana malam imersif dengan tata cahaya dan audio yang artistik.' },
        { title: 'AV ARENA', desc: 'Kompetisi pertempuran dengan mekanik yang responsif dan seimbang.' },
        { title: 'TEMPAT NONGKRONG', desc: 'Ruang kolaborasi sosial untuk berinteraksi dalam lingkungan yang asri.' },
        { title: 'MENJADI PETANI', desc: 'Simulasi manajemen sumber daya dan pembangunan ekonomi yang mendalam.' },
        { title: 'PARKOUR CITY BLUE', desc: 'Navigasi urban futuristik yang mengandalkan presisi dan kecepatan.' },
        { title: 'ORANG HILANG', desc: 'Pengalaman horor psikologis dengan alur cerita yang mencekam.' },
        { title: 'BALI Paradise', desc: 'Jelajahi keindahan Pulau Bali dengan pantai, pura, dan budaya yang memukau.' },
        { title: 'SURGA DUNIA', desc: 'Nikmati suasana surga dunia dengan pemandangan alam yang luar biasa indah.' }
      ]
    },
    services: {
      badge: 'KEAHLIAN KAMI',
      title1: 'LAYANAN',
      title2: 'PROFESIONAL',
      subtitle: 'Solusi pengembangan game end-to-end yang disesuaikan dengan kebutuhan Anda',
      list: [
        {
          title: 'Arsitektur Dunia Roblox',
          desc: 'Penciptaan lingkungan virtual yang kompleks dengan perhatian mendalam pada estetika dan performa.',
          features: ['Level Design', '3D Modeling', 'Lighting Art']
        },
        {
          title: 'Logika & Scripting Sistem',
          desc: 'Implementasi kode Lua yang efisien untuk sistem game yang skalabel dan mekanik yang inovatif.',
          features: ['Sistem Backend', 'Mekanik Kustom', 'Integrasi Data']
        },
        {
          title: 'Integrasi Audio Dinamis',
          desc: 'Desain suara yang meningkatkan imersi pemain melalui audio responsif dan komposisi kustom.',
          features: ['Soundscapes', 'Audio Dinamis', 'Sound FX']
        },
        {
          title: 'Antarmuka Pengguna (UI/UX)',
          desc: 'Desain visual yang fungsional dan estetis, dioptimalkan untuk pengalaman pengguna terbaik.',
          features: ['Visual Design', 'User Journey', 'Multi-platform']
        },
        {
          title: 'Efek Visual & Atmosfer',
          desc: 'Pengembangan efek partikel dan sistem pencahayaan untuk menciptakan identitas visual yang unik.',
          features: ['VFX Production', 'Atmospheric FX', 'Shaders']
        },
        {
          title: 'Optimasi Performa',
          desc: 'Memastikan game berjalan lancar di berbagai perangkat melalui audit dan penyempurnaan teknis.',
          features: ['Code Audit', 'Asset Optimization', 'Frame Stability']
        },
        {
          title: 'Ekosistem Komunitas',
          desc: 'Membangun fitur sosial yang meningkatkan retensi dan interaksi antar pemain.',
          features: ['Social Integration', 'Reward Systems', 'Analytics']
        }
      ]
    },
    portfolio: {
      badge: 'HASIL KARYA',
      title: 'PORTOFOLIO',
      subtitle: 'Representasi proyek-proyek strategis yang telah kami selesaikan dengan sukses',
      categories: ['Semua', 'Dunia Terbuka', 'Shooter', 'RPG', 'Balapan', 'Survival', 'Sosial'],
      view_project: 'Detail Proyek',
      items: [
        { title: 'Neon District', desc: 'Metropolis futuristik dengan detail lingkungan tinggi dan sistem pencahayaan dinamis.' },
        { title: 'Galactic Warfare', desc: 'Simulasi pertempuran antariksa dengan mekanik kendaraan yang kompleks.' },
        { title: 'Shadow Realms', desc: 'Dunia fantasi dengan sistem narasi dan perkembangan karakter yang mendalam.' },
        { title: 'Speed Legends', desc: 'Pengalaman balap kompetitif dengan fokus pada presisi kendali.' },
        { title: 'Apocalypse Rising', desc: 'Dunia survival pasca-apokaliptik dengan elemen strategi yang menantang.' },
        { title: 'Party Paradise', desc: 'Platform interaksi sosial dengan berbagai aktivitas hiburan kustom.' }
      ]
    },
    pricing: {
      badge: 'INVESTASI',
      title1: 'PILIHAN',
      title2: 'STRATEGIS',
      subtitle: 'Struktur biaya transparan yang dirancang untuk mendukung pertumbuhan proyek Anda',
      most_popular: 'REKOMENDASI UTAMA',
      per_project: '/ proyek',
      plans: [
        {
          name: 'Starter',
          desc: 'Ideal untuk pengembangan aset spesifik dan proyek skala mikro',
          price_idr: 'Rp 500rb',
          price_usd: '$35',
          features: ['Desain Dasar', 'Scripting Inti', 'UI Kit Standar', 'Revisi Terbatas', 'Pengiriman Cepat', 'Dukungan Teknis']
        },
        {
          name: 'Premium',
          desc: 'Solusi lengkap untuk pengembangan map game yang komprehensif',
          price_idr: 'Rp 1.5Jt',
          price_usd: '$99',
          features: ['Desain Lingkungan Lanjut', 'Sistem Mekanik Kustom', 'Full UI/UX Design', 'VFX & Atmosfer', 'Revisi Fleksibel', 'Prioritas Pengerjaan', 'Dukungan Eksklusif', 'Aset Mentah']
        },
        {
          name: 'Ultimate Studio',
          desc: 'Standar kualitas industri untuk proyek berskala besar',
          price_idr: 'Rp 10Jt',
          price_usd: '$650',
          features: ['Pengembangan Full AAA', 'Sistem AI Kompleks', 'Premium Interface', 'Visual Sinematik', 'Optimasi Menyeluruh', 'Revisi Berkelanjutan', 'Manajemen Proyek', 'Dukungan 24/7', 'Akses Kode Penuh', 'Konsultasi Strategis']
        }
      ]
    },
    community: {
      badge: 'EKOSISTEM KREATIF',
      title1: 'GABUNG',
      title2: 'KOMUNITAS KAMI',
      subtitle: 'Bergabunglah dengan jaringan pengembang dan pemain profesional untuk bertukar ide dan pengalaman.',
      discord_btn: 'Akses Server Discord',
      online_status: 'anggota aktif saat ini',
      stats: {
        members: 'Anggota',
        tournaments: 'Event',
        active: 'Aktif',
        messages: 'Interaksi'
      }
    },
    gallery: {
      badge: 'GALERI AKTIVITAS',
      title1: 'JEJAK',
      title2: 'PERJALANAN',
      subtitle: 'Dokumentasi visual dari berbagai inisiatif dan kolaborasi dalam komunitas AV GAME STUDIO.'
    },
    assets: {
      badge: 'KATALOG ASET',
      title1: 'KOLEKSI',
      title2: 'ASET GAME',
      subtitle: 'Tingkatkan proyek Anda dengan aset berkualitas tinggi. Tersedia pilihan berbayar dan gratis.',
      view_all: 'Lihat Semua Aset',
      free_label: 'GRATIS',
      paid_label: 'BERBAYAR',
      get_now: 'Dapatkan Sekarang',
      items: [
        { title: 'Paket Tekstur Alam', type: 'free', desc: 'Kumpulan tekstur alam berkualitas tinggi untuk lingkungan game Anda.', link: 'https://discord.gg/vNjDDVf' },
        { title: 'Sistem Pencahayaan Pro', type: 'paid', desc: 'Script pencahayaan dinamis untuk menciptakan atmosfer imersif.', price: 'Rp 50.000', link: 'https://wa.me/62895327025015?text=Halo%20AV%20GAME%20STUDIO,%20saya%20ingin%20membeli%20Aset%20Sistem%20Pencahayaan%20Pro' },
        { title: 'Model Karakter Dasar', type: 'free', desc: 'Model karakter dasar yang siap digunakan untuk prototipe game.', link: 'https://discord.gg/vNjDDVf' },
        { title: 'UI Kit Futuristik', type: 'paid', desc: 'Set antarmuka pengguna modern dengan tema sci-fi.', price: 'Rp 75.000', link: 'https://wa.me/62895327025015?text=Halo%20AV%20GAME%20STUDIO,%20saya%20ingin%20membeli%20Aset%20UI%20Kit%20Futuristik' }
      ]
    },
    contact: {
      badge: 'KONSULTASI',
      title1: 'MULAI',
      title2: 'KOLABORASI',
      subtitle: 'Konsultasikan visi proyek Anda dengan tim ahli kami. Kami siap menghadirkan solusi pengembangan yang tepat sasaran.',
      form: {
        name: 'Nama Lengkap',
        name_placeholder: 'Masukkan nama lengkap Anda',
        email: 'Alamat Email',
        email_placeholder: 'nama@perusahaan.com',
        project_type: 'Kategori Layanan',
        project_placeholder: 'Pilih kategori proyek',
        details: 'Deskripsi Kebutuhan',
        details_placeholder: 'Jelaskan visi dan tujuan proyek Anda...',
        submit: 'Kirim via WhatsApp',
        success: 'Pesan Berhasil Terkirim!'
      },
      types: ['Arsitektur Map', 'Sistem Scripting', 'Desain UI/UX', 'Solusi End-to-End', 'Konsultasi Teknis']
    },
    footer: {
      desc: 'Menghadirkan pengalaman Roblox premium melalui sinergi teknologi mutakhir dan kreativitas strategis. Visi Anda, keahlian kami.',
      services: 'LAYANAN',
      company: 'PROFIL',
      connect: 'KONTAK',
      made_with: 'Dikembangkan dengan',
      for_gamers: 'untuk komunitas',
      rights: 'Seluruh hak cipta dilindungi.'
    },
    robux_packages: [
      {
        name: '100 Robux',
        price: 'Rp 15.000',
        description: 'Pilihan hemat untuk top up kecil, trial buy, atau kebutuhan item ringan.',
        badge: 'FAST',
        meta: 'Proses 5-15 menit',
        stock: 'Ready'
      },
      {
        name: '300 Robux',
        price: 'Rp 50.000',
        description: 'Nominal favorit untuk gamepass, UGC basic, dan kebutuhan top up harian.',
        badge: 'BEST SELLER',
        meta: 'Paling sering dipesan',
        stock: 'Ready',
        featured: true
      },
      {
        name: '1000 Robux',
        price: 'Rp 150.000',
        description: 'Cocok untuk pembelian item premium, bundle avatar, dan kebutuhan creator.',
        badge: 'SAVE MORE',
        meta: 'Paket hemat besar',
        stock: 'Ready'
      },
      {
        name: '2000 Robux',
        price: 'Rp 290.000',
        description: 'Pilihan terbaik untuk top up skala besar dengan harga lebih bersahabat.',
        badge: 'BIG VALUE',
        meta: 'Untuk player aktif',
        stock: 'Ready'
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
    market_categories: ['Semua', 'Mobile', 'PC', 'Roblox']
  },
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      services: 'Services',
      portfolio: 'Portfolio',
      gallery: 'Gallery',
      assets: 'Assets',
      topup: 'Top Up Robux',
      topgame: 'Top Up Game',
      pricing: 'Pricing',
      contact: 'Contact',
      topup_btn: 'TOP UP NOW'
    },
    hero: {
      status: 'AV STUDIO • READY TO BUILD YOUR DREAM PROJECT',
      title1: 'AV GAME',
      title2: 'STUDIO',
      subtitle: 'Building Premium Roblox Experiences',
      subtitle2: 'Transform Your Game Ideas With Roblox Development Experts',
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
      badge: 'TRUSTED TOP UP SERVICES',
      title1: 'TOP UP',
      title2: 'ROBUX',
      subtitle: 'Safe and efficient Robux top up services. Competitive pricing with manual delivery system.',
      market_badge: 'ROBUX MARKET',
      market_title: 'Get Your Robux Instantly',
      market_desc: 'Select your desired nominal and complete transactions through our payment system.',
      search_placeholder: 'Search nominal or package...',
      promo_flow: 'TRANSACTION FLOW',
      promo_title: 'Safe, Fast, & Transparent',
      promo_desc: 'Easy ordering process for your convenience. Select, pay, and claim your Robux via WhatsApp.',
      stats: {
        fast: 'Express Service',
        fast_val: 'Quick Process',
        safe: 'Guaranteed',
        safe_val: '100% Secure',
        price: 'Efficiency',
        price_val: 'Best Value',
        fit: 'Flexible',
        fit_val: 'All Needs'
      },
      etalase_title: 'Robux Catalog',
      etalase_desc: 'A curated selection of Robux packages designed to meet your gaming requirements.',
      ready_stock: 'READY STOCK',
      hot_item: 'FEATURED',
      tab_robux: 'Top Up Robux',
      tab_games: 'Top Up Games',
      final_price: 'Final Price',
      order_desc: 'Complete your order by entering your username and making a payment.',
      order_btn: 'BUY NOW',
      avatar_services: {
        title: 'Avatar Item Services',
        desc: 'Enhance your character\'s visual identity with high-quality custom assets.',
        chat: 'Consult Now'
      },
      info_transaksi: {
        title: 'TRANSACTION GUIDE',
        flow_title: 'Integrated Payment System',
        flow_desc: 'Midtrans integration allows every order to be confirmed instantly for immediate admin processing.',
        easy_title: 'Ease of Ordering',
        easy_desc: 'Simply enter your Roblox username, select a package, complete payment, and claim via WA.'
      },
      community_check: {
        title: 'Community Member Verification',
        desc: 'Exclusive service for community members. Please ensure you have joined our official group.',
        join_btn: 'JOIN ROBLOX GROUP',
        input_placeholder: 'Enter Your Roblox Username...',
        check_btn: 'VERIFY STATUS',
        checking: 'Processing...',
        status_member: 'VERIFIED: Service accessible.',
        status_not_member: 'NOT REGISTERED: Please join the group first.',
        status_error: 'Identity not found.',
        membership_info: 'Ensure the username matches your Roblox profile data.',
        realtime_stock: 'Real-time Group Stock'
      }
    },
    featured_maps: {
      badge: 'FEATURED PROJECTS',
      title1: 'EXPERIENCE',
      title2: 'PORTFOLIO',
      subtitle: 'A collection of premium virtual worlds developed with industry-standard quality',
      play_now: 'Play Now',
      categories: {
        adventure: 'World Exploration',
        extreme: 'Extreme Challenge',
        social: 'Social Interaction',
        fighting: 'Competitive Arena',
        farming: 'Economic Simulator',
        parkour: 'Physical Agility',
        mystery: 'Narrative & Mystery'
      },
      status: {
        featured: 'FEATURED',
        new: 'NEW',
        popular: 'POPULAR',
        live: 'ACTIVE'
      },
      stats: {
        players: 'Active Players',
        rating: 'Community Rating'
      },
      maps: [
        { title: 'MOUNT BANDA NEIRA', desc: 'Explore majestic natural beauty with stunning visuals.' },
        { title: 'MT BANDA NEIRA JALUR EXTREAM', desc: 'Test your limits in the most challenging terrain.' },
        { title: 'NIGHT VIBES', desc: 'Immersive night atmosphere with artistic lighting and audio.' },
        { title: 'AV ARENA', desc: 'Combat competition with responsive and balanced mechanics.' },
        { title: 'TEMPAT NONGKRONG', desc: 'Social collaboration space to interact in a lush environment.' },
        { title: 'MENJADI PETANI', desc: 'Deep resource management and economic building simulation.' },
        { title: 'PARKOUR CITY BLUE', desc: 'Futuristic urban navigation relying on precision and speed.' },
        { title: 'ORANG HILANG', desc: 'Psychological horror experience with a gripping storyline.' },
        { title: 'BALI Paradise', desc: 'Explore the beauty of Bali Island with stunning beaches, temples, and culture.' },
        { title: 'SURGA DUNIA', desc: 'Enjoy a heavenly atmosphere with extraordinary natural scenery.' }
      ]
    },
    services: {
      badge: 'OUR EXPERTISE',
      title1: 'PROFESSIONAL',
      title2: 'SERVICES',
      subtitle: 'End-to-end game development solutions tailored to your needs',
      list: [
        {
          title: 'Roblox World Architecture',
          desc: 'Creation of complex virtual environments with deep attention to aesthetics and performance.',
          features: ['Level Design', '3D Modeling', 'Lighting Art']
        },
        {
          title: 'System Logic & Scripting',
          desc: 'Efficient Lua code implementation for scalable game systems and innovative mechanics.',
          features: ['Backend Systems', 'Custom Mechanics', 'Data Integration']
        },
        {
          title: 'Dynamic Audio Integration',
          desc: 'Sound design that enhances player immersion through responsive audio and custom compositions.',
          features: ['Soundscapes', 'Dynamic Audio', 'Sound FX']
        },
        {
          title: 'User Interface (UI/UX)',
          desc: 'Functional and aesthetic visual design, optimized for the best user experience.',
          features: ['Visual Design', 'User Journey', 'Multi-platform']
        },
        {
          title: 'Visual Effects & Atmosphere',
          desc: 'Development of particle effects and lighting systems to create a unique visual identity.',
          features: ['VFX Production', 'Atmospheric FX', 'Shaders']
        },
        {
          title: 'Performance Optimization',
          desc: 'Ensuring smooth gameplay across devices through technical audits and refinement.',
          features: ['Code Audit', 'Asset Optimization', 'Frame Stability']
        },
        {
          title: 'Community Ecosystem',
          desc: 'Building social features that increase retention and interaction between players.',
          features: ['Social Integration', 'Reward Systems', 'Analytics']
        }
      ]
    },
    portfolio: {
      badge: 'OUR WORK',
      title: 'PORTFOLIO',
      subtitle: 'Representation of strategic projects successfully completed by our team',
      categories: ['All', 'Open World', 'Shooter', 'RPG', 'Racing', 'Survival', 'Social'],
      view_project: 'Project Details',
      items: [
        { title: 'Neon District', desc: 'Futuristic metropolis with high environmental detail and dynamic lighting.' },
        { title: 'Galactic Warfare', desc: 'Space combat simulation with complex vehicle mechanics.' },
        { title: 'Shadow Realms', desc: 'Fantasy world with deep narrative and character progression systems.' },
        { title: 'Speed Legends', desc: 'Competitive racing experience focused on control precision.' },
        { title: 'Apocalypse Rising', desc: 'Post-apocalyptic survival world with challenging strategic elements.' },
        { title: 'Party Paradise', desc: 'Social interaction platform with various custom entertainment activities.' }
      ]
    },
    pricing: {
      badge: 'INVESTMENT',
      title1: 'STRATEGIC',
      title2: 'CHOICE',
      subtitle: 'Transparent cost structures designed to support your project\'s growth',
      most_popular: 'TOP RECOMMENDATION',
      per_project: '/ project',
      plans: [
        {
          name: 'Starter',
          desc: 'Ideal for specific asset development and micro-scale projects',
          price_idr: 'Rp 500rb',
          price_usd: '$35',
          features: ['Basic Design', 'Core Scripting', 'Standard UI Kit', 'Limited Revisions', 'Fast Delivery', 'Technical Support']
        },
        {
          name: 'Premium',
          desc: 'Complete solution for comprehensive game map development',
          price_idr: 'Rp 1.5Jt',
          price_usd: '$99',
          features: ['Advanced Environment Design', 'Custom Mechanics Systems', 'Full UI/UX Design', 'VFX & Atmosphere', 'Flexible Revisions', 'Priority Processing', 'Exclusive Support', 'Source Assets']
        },
        {
          name: 'Ultimate Studio',
          desc: 'Industry-standard quality for large-scale projects',
          price_idr: 'Rp 10Jt',
          price_usd: '$650',
          features: ['Full AAA Development', 'Complex AI Systems', 'Premium Interface', 'Cinematic Visuals', 'Comprehensive Optimization', 'Continuous Revisions', 'Project Management', '24/7 Support', 'Full Code Access', 'Strategic Consultation']
        }
      ]
    },
    community: {
      badge: 'CREATIVE ECOSYSTEM',
      title1: 'JOIN OUR',
      title2: 'COMMUNITY',
      subtitle: 'Join a network of professional developers and players to exchange ideas and experiences.',
      discord_btn: 'Access Discord Server',
      online_status: 'active members online',
      stats: {
        members: 'Members',
        tournaments: 'Events',
        active: 'Active',
        messages: 'Interactions'
      }
    },
    gallery: {
      badge: 'ACTIVITY GALLERY',
      title1: 'OUR',
      title2: 'JOURNEY',
      subtitle: 'Visual documentation of various initiatives and collaborations within the AV GAME STUDIO community.'
    },
    assets: {
      badge: 'ASSET CATALOG',
      title1: 'GAME ASSET',
      title2: 'COLLECTION',
      subtitle: 'Enhance your projects with high-quality assets. Both paid and free options available.',
      view_all: 'View All Assets',
      free_label: 'FREE',
      paid_label: 'PAID',
      get_now: 'Get Now',
      items: [
        { title: 'Nature Texture Pack', type: 'free', desc: 'A collection of high-quality nature textures for your game environment.', link: 'https://discord.gg/vNjDDVf' },
        { title: 'Pro Lighting System', type: 'paid', desc: 'Dynamic lighting script to create an immersive atmosphere.', price: 'Rp 50.000', link: 'https://wa.me/62895327025015?text=Hello%20AV%20GAME%20STUDIO,%20I%20want%20to%20buy%20Pro%20Lighting%20System%20Asset' },
        { title: 'Basic Character Models', type: 'free', desc: 'Basic character models ready for game prototyping.', link: 'https://discord.gg/vNjDDVf' },
        { title: 'Futuristic UI Kit', type: 'paid', desc: 'Modern user interface set with a sci-fi theme.', price: 'Rp 75.000', link: 'https://wa.me/62895327025015?text=Hello%20AV%20GAME%20STUDIO,%20I%20want%20to%20buy%20Futuristic%20UI%20Kit%20Asset' }
      ]
    },
    contact: {
      badge: 'CONSULTATION',
      title1: 'START',
      title2: 'COLLABORATION',
      subtitle: 'Consult your project vision with our expert team. We are ready to deliver targeted development solutions.',
      form: {
        name: 'Full Name',
        name_placeholder: 'Enter your full name',
        email: 'Email Address',
        email_placeholder: 'name@company.com',
        project_type: 'Service Category',
        project_placeholder: 'Select project category',
        details: 'Requirement Description',
        details_placeholder: 'Explain your project vision and goals...',
        submit: 'Send via WhatsApp',
        success: 'Message Successfully Sent!'
      },
      types: ['Map Architecture', 'Scripting Systems', 'UI/UX Design', 'End-to-End Solutions', 'Technical Consultation']
    },
    footer: {
      desc: 'Delivering premium Roblox experiences through the synergy of cutting-edge technology and strategic creativity. Your vision, our expertise.',
      services: 'SERVICES',
      company: 'PROFILE',
      connect: 'CONTACT',
      made_with: 'Developed with',
      for_gamers: 'for community',
      rights: 'All rights reserved.'
    },
    robux_packages: [
      {
        name: '100 Robux',
        price: 'Rp 15.000',
        description: 'Budget-friendly choice for small top ups, trial buys, or light item needs.',
        badge: 'FAST',
        meta: '5-15 mins process',
        stock: 'Ready'
      },
      {
        name: '300 Robux',
        price: 'Rp 50.000',
        description: 'Favorite nominal for gamepasses, basic UGC, and daily top up needs.',
        badge: 'BEST SELLER',
        meta: 'Most frequently ordered',
        stock: 'Ready',
        featured: true
      },
      {
        name: '1000 Robux',
        price: 'Rp 150.000',
        description: 'Suitable for premium item purchases, avatar bundles, and creator needs.',
        badge: 'SAVE MORE',
        meta: 'Big savings pack',
        stock: 'Ready'
      },
      {
        name: '2000 Robux',
        price: 'Rp 290.000',
        description: 'Best choice for large-scale top up with friendlier prices.',
        badge: 'BIG VALUE',
        meta: 'For active players',
        stock: 'Ready'
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
    market_categories: ['All', 'Mobile', 'PC', 'Roblox']
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
