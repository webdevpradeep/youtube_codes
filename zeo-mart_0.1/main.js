let currentUser = null;
let cart = [];
let wishlist = [];
let orders = [];
let currentBanner = 0;
let currentQuantity = 1;
let selectedProduct = null;
let currentCategory = null;
let userReviews = {};
let currentRating = 0;

const categories = [
  {
    name: 'Electronics',
    image: '📱',
    fromColor: '#60a5fa',
    toColor: '#1e40af',
  },
  {
    name: 'Fashion',
    image: '👔',
    fromColor: '#f472b6',
    toColor: '#be185d',
  },
  { name: 'Home', image: '🪑', fromColor: '#4ade80', toColor: '#166534' },
  {
    name: 'Sports',
    image: '⚽',
    fromColor: '#facc15',
    toColor: '#854d0e',
  },
  {
    name: 'Books',
    image: '📚',
    fromColor: '#a78bfa',
    toColor: '#5b21b6',
  },
  {
    name: 'Beauty',
    image: '💄',
    fromColor: '#f87171',
    toColor: '#7f1d1d',
  },
];

// Generate 200+ Products Function
const productImages = {
  Electronics: [
    'images/electronics/BluetoothSpeaker.png',
    'images/electronics/Earbuds.png',
    'images/electronics/GamingMouse.png',
    'images/electronics/HDMICable.png',
    'images/electronics/Keyboard.png',
    'images/electronics/LaptopBag.png',
    'images/electronics/LaptopStand.png',
    'images/electronics/Monitor.png',
    'images/electronics/MousePad.png',
    'images/electronics/PhoneCase.png',
    'images/electronics/PhoneStand.png',
    'images/electronics/PortableCharger.png',
    'images/electronics/ScreenProtector.png',
    'images/electronics/smartwatch.png',
    'images/electronics/USBCable.png',
    'images/electronics/USBFlashDrive.png',
    'images/electronics/USBHub.png',
    'images/electronics/WebcamHD.png',
    'images/electronics/WirelessCharger.png',
    'images/electronics/WirelessHeadphones.png',
  ],
  Fashion: [
    'images/fashion/Backpack.png',
    'images/fashion/BaseballCap.png',
    'images/fashion/Belt.png',
    'images/fashion/Cardigan.png',
    'images/fashion/CasualShorts.png',
    'images/fashion/DenimJeans.png',
    'images/fashion/DesignerSunglasses.png',
    'images/fashion/FormalShirt.png',
    'images/fashion/Gloves.png',
    'images/fashion/Hoodie.png',
    'images/fashion/KhakiPants.png',
    'images/fashion/LeatherWallet.png',
    'images/fashion/PoloShirt.png',
    'images/fashion/Scarf.png',
    'images/fashion/Sneakers.png',
    'images/fashion/SocksPack.png',
    'images/fashion/SportsShoes.png',
    'images/fashion/Sweater.png',
    'images/fashion/T-ShirtPack.png',
    'images/fashion/WinterJacket.png',
  ],
  Home: [
    'images/home/BedSheet.png',
    'images/home/CoatHanger.png',
    'images/home/CoffeeMaker.png',
    'images/home/Curtains.png',
    'images/home/DeskLamp.png',
    'images/home/DiningChair.png',
    'images/home/DishRack.png',
    'images/home/DoorMat.png',
    'images/home/ElectricKettle.png',
    'images/home/Mirror.png',
    'images/home/PictureFrame.png',
    'images/home/Pillow.png',
    'images/home/PlantPot.png',
    'images/home/Rug.png',
    'images/home/Showpiece.png',
    'images/home/StorageBox.png',
    'images/home/TableLamp.png',
    'images/home/TrashBin.png',
    'images/home/WallClock.png',
  ],
  Sports: [
    'images/sports/BadmintonRacket.png',
    'images/sports/Basketball.png',
    'images/sports/BoxingGloves.png',
    'images/sports/CricketBat.png',
    'images/sports/CyclingHelmet.png',
    'images/sports/DumbbellsSet.png',
    'images/sports/FitnessTracker.png',
    'images/sports/Football.png',
    'images/sports/gymBag.png',
    'images/sports/JumpRope.png',
    'images/sports/PunchingBag.png',
    'images/sports/ResistanceBands.png',
    'images/sports/RunningShoes.png',
    'images/sports/shoes.jpg',
    'images/sports/Skateboard.png',
    'images/sports/SkippingRope.png',
    'images/sports/SwimmingGoggles.png',
    'images/sports/TennisRacket.png',
    'images/sports/WaterBottle.png',
    'images/sports/YogaBlocks.png',
    'images/sports/YogaMat.png',
  ],
  Books: [
    'images/books/ArtBook.png',
    'images/books/Autobiography.png',
    'images/books/Biography.png',
    'images/books/BusinessBook.png',
    'images/books/ComicBook.png',
    'images/books/CookingBook.png',
    'images/books/EducationalBook.png',
    'images/books/FictionNovel.png',
    'images/books/HistoryBook.png',
    'images/books/KidsStory.png',
    'images/books/MotivationalBook.png',
    'images/books/MysteryNovel.png',
    'images/books/PhilosophyBook.png',
    'images/books/PoetryCollection.png',
    'images/books/RomanceNovel.png',
    'images/books/ScienceBook.png',
    'images/books/SelfHelpBook.png',
    'images/books/techGuide.png',
    'images/books/ThrillerNovel.png',
    'images/books/travelGuide.png',
  ],
  Beauty: [
    'images/beauty/Blush.png',
    'images/beauty/BodyLotion.png',
    'images/beauty/Concealer.png',
    'images/beauty/Conditioner.png',
    'images/beauty/EyeCream.png',
    'images/beauty/Eyeliner.png',
    'images/beauty/Eyeshadow.png',
    'images/beauty/FaceMask.png',
    'images/beauty/FaceScrub.png',
    'images/beauty/FaceWash.png',
    'images/beauty/foundation.png',
    'images/beauty/HairOil.png',
    'images/beauty/Lipstick.png',
    'images/beauty/Mascara.png',
    'images/beauty/MoisturizerCream.png',
    'images/beauty/NailPolish.png',
    'images/beauty/Serum.png',
    'images/beauty/Sunscreen.png',
    'images/beauty/Toner.png',
  ],
};

function generateProducts() {
  const products = [];
  let id = 1;

  const electronicsNames = [
    'Wireless Headphones',
    'Smart Watch',
    'Bluetooth Speaker',
    'Phone Case',
    'Portable Charger',
    'Webcam HD',
    'Gaming Mouse',
    'Screen Protector',
    'USB Cable',
    'Phone Stand',
    'Wireless Charger',
    'USB Hub',
    'Earbuds',
    'Laptop Stand',
    'Keyboard',
    'Monitor',
    'HDMI Cable',
    'Laptop Bag',
    'Mouse Pad',
    'USB Flash Drive',
  ];

  const fashionNames = [
    'Designer Sunglasses',
    'T-Shirt Pack',
    'Winter Jacket',
    'Denim Jeans',
    'Backpack',
    'Leather Wallet',
    'Sports Shoes',
    'Formal Shirt',
    'Casual Shorts',
    'Hoodie',
    'Baseball Cap',
    'Socks Pack',
    'Belt',
    'Scarf',
    'Gloves',
    'Sweater',
    'Polo Shirt',
    'Khaki Pants',
    'Sneakers',
    'Cardigan',
  ];

  const homeNames = [
    'Desk Lamp',
    'Coffee Maker',
    'Kitchen Scale',
    'Table Lamp',
    'Electric Kettle',
    'Pillow',
    'Bed Sheet',
    'Dining Chair',
    'Showpiece',
    'Door Mat',
    'Wall Clock',
    'Storage Box',
    'Curtains',
    'Rug',
    'Mirror',
    'Plant Pot',
    'Coat Hanger',
    'Dish Rack',
    'Trash Bin',
    'Picture Frame',
  ];

  const sportsNames = [
    'Yoga Mat',
    'Running Shoes',
    'Fitness Tracker',
    'Cricket Bat',
    'Badminton Racket',
    'Basketball',
    'Swimming Goggles',
    'Dumbbells Set',
    'Gym Bag',
    'Resistance Bands',
    'Jump Rope',
    'Cycling Helmet',
    'Skateboard',
    'Tennis Racket',
    'Football',
    'Boxing Gloves',
    'Yoga Blocks',
    'Water Bottle',
    'Skipping Rope',
    'Punching Bag',
  ];

  const booksNames = [
    'Self Help Book',
    'Fiction Novel',
    'Biography',
    'Tech Guide',
    'Cooking Book',
    'Travel Guide',
    'Kids Story',
    'Business Book',
    'Mystery Novel',
    'Science Book',
    'History Book',
    'Poetry Collection',
    'Comic Book',
    'Philosophy Book',
    'Art Book',
    'Autobiography',
    'Thriller Novel',
    'Romance Novel',
    'Educational Book',
    'Motivational Book',
  ];

  const beautyNames = [
    'Face Wash',
    'Moisturizer Cream',
    'Lipstick',
    'Sunscreen',
    'Hair Oil',
    'Face Mask',
    'Shampoo',
    'Conditioner',
    'Body Lotion',
    'Eye Cream',
    'Nail Polish',
    'Foundation',
    'Concealer',
    'Blush',
    'Eyeshadow',
    'Mascara',
    'Eyeliner',
    'Toner',
    'Serum',
    'Face Scrub',
  ];

  const allNames = {
    Electronics: electronicsNames,
    Fashion: fashionNames,
    Home: homeNames,
    Sports: sportsNames,
    Books: booksNames,
    Beauty: beautyNames,
  };

  categories.forEach((cat) => {
    for (let i = 0; i < 35; i++) {
      const name =
        allNames[cat.name][
          Math.floor(Math.random() * allNames[cat.name].length)
        ];
      const price = Math.floor(Math.random() * 8000) + 299;
      const discountPrice = Math.floor(price * (1 - Math.random() * 0.5));

      const imageList = productImages[cat.name];
      const image = imageList[Math.floor(Math.random() * imageList.length)];

      products.push({
        id: id++,
        name: name + ' ' + (i + 1),
        category: cat.name,
        price: price,
        discountPrice: discountPrice,
        rating: Math.floor(Math.random() * 3) + 3,
        reviews: Math.floor(Math.random() * 500) + 50,
        image: image,
        description: `High-quality ${name}. Perfect for your needs!`,
      });
    }
  });

  return products;
}

const allProducts = generateProducts();

// Initialize
renderCategoryCards();
renderProducts(allProducts);
updateBanner();
loadFromStorage();

function renderCategoryCards() {
  const container = document.getElementById('categoryContainer');
  container.innerHTML = '';

  categories.forEach((cat) => {
    const count = allProducts.filter((p) => p.category === cat.name).length;
    container.innerHTML += `
                    <div class="category-card" style="--from-color: ${cat.fromColor}; --to-color: ${cat.toColor};" onclick="goToCategoryPage('${cat.name}')">
                        <div class="text-4xl mb-2">${cat.image}</div>
                        <p class="font-semibold text-sm">${cat.name}</p>
                        <p class="text-xs opacity-80">(${count})</p>
                    </div>
                `;
  });
}

function goToPage(pageName) {
  document
    .querySelectorAll('.page')
    .forEach((p) => p.classList.remove('active'));
  document.getElementById(pageName).classList.add('active');
  window.scrollTo(0, 0);
  document.getElementById('profileDropdown').classList.remove('active');
}

function goToCategoryPage(cat) {
  currentCategory = cat;
  document.getElementById('categoryTitle').textContent = cat + ' Products';
  const products = allProducts.filter((p) => p.category === cat);
  renderCategoryProducts(products);
  goToPage('category');
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) {
    showToast('Fill all fields', 'error');
    return;
  }
  currentUser = {
    id: Math.random(),
    email: email,
    firstName: email.split('@')[0],
    lastName: 'User',
  };
  saveToStorage();
  updateProfileMenu();
  goToPage('home');
  showToast('Logged in! 🎉');
}

function handleSignup() {
  const firstName = document.getElementById('signupFirstName').value;
  const lastName = document.getElementById('signupLastName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const terms = document.getElementById('termsCheckbox').checked;

  if (!firstName || !lastName || !email || !password || !terms) {
    showToast('Fill all fields', 'error');
    return;
  }

  currentUser = {
    id: Math.random(),
    email: email,
    firstName: firstName,
    lastName: lastName,
  };
  saveToStorage();
  updateProfileMenu();
  goToPage('home');
  showToast('Account created! 🎉');
}

function demoLogin() {
  currentUser = {
    id: 123,
    email: 'test@example.com',
    firstName: 'Demo',
    lastName: 'User',
  };
  saveToStorage();
  updateProfileMenu();
  goToPage('home');
  showToast('Demo login! 🎉');
}

function logout() {
  currentUser = null;
  saveToStorage();
  updateProfileMenu();
  goToPage('home');
  showToast('Logged out');
}

function updateProfileMenu() {
  const loggedOut = document.getElementById('loggedOutMenu');
  const loggedIn = document.getElementById('loggedInMenu');

  if (currentUser) {
    loggedOut.classList.add('hidden');
    loggedIn.classList.remove('hidden');
    document.getElementById('userNameDisplay').textContent =
      currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('profileName').textContent =
      currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileFirstName').value = currentUser.firstName;
    document.getElementById('profileLastName').value = currentUser.lastName;
    document.getElementById('profileEmailInput').value = currentUser.email;
  } else {
    loggedOut.classList.remove('hidden');
    loggedIn.classList.add('hidden');
  }
}

function toggleProfileMenu() {
  document.getElementById('profileDropdown').classList.toggle('active');
}

function renderProducts(prod) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  prod.forEach((p) => {
    const disc = Math.round(((p.price - p.discountPrice) / p.price) * 100);
    const rating = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);

    grid.innerHTML += `
                    <div class="bg-white rounded-lg shadow-soft overflow-hidden product-card" onclick="openProductModal(${p.id})">
                        <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                           <img src="${p.image}">
                            <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">-${disc}%</div>
                        </div>
                        <div class="p-4">
                            <p class="text-xs text-gray-500 uppercase mb-1">${p.category}</p>
                            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${p.name}</h3>
                            <div class="flex items-center gap-1 mb-2">
                                <span class="text-yellow-400 text-sm">${rating}</span>
                                <span class="text-xs text-gray-500">(${p.reviews})</span>
                            </div>
                            <div class="flex items-center gap-2 mb-3">
                                <span class="text-lg font-bold text-orange-500">₹${p.discountPrice}</span>
                                <span class="text-sm text-gray-500 line-through">₹${p.price}</span>
                            </div>
                            <p class="text-xs text-green-600 font-semibold">In Stock</p>
                        </div>
                    </div>
                `;
  });
}

function renderCategoryProducts(prod) {
  const grid = document.getElementById('categoryProductsGrid');
  grid.innerHTML = '';
  prod.forEach((p) => {
    const disc = Math.round(((p.price - p.discountPrice) / p.price) * 100);
    const rating = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);

    grid.innerHTML += `
                    <div class="bg-white rounded-lg shadow-soft overflow-hidden product-card" onclick="openProductModal(${p.id})">
                        <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                           <img src="${p.image}">
                            <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">-${disc}%</div>
                        </div>
                        <div class="p-4">
                            <p class="text-xs text-gray-500 uppercase mb-1">${p.category}</p>
                            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${p.name}</h3>
                            <div class="flex items-center gap-1 mb-2">
                                <span class="text-yellow-400 text-sm">${rating}</span>
                                <span class="text-xs text-gray-500">(${p.reviews})</span>
                            </div>
                            <div class="flex items-center gap-2 mb-3">
                                <span class="text-lg font-bold text-orange-500">₹${p.discountPrice}</span>
                                <span class="text-sm text-gray-500 line-through">₹${p.price}</span>
                            </div>
                            <p class="text-xs text-green-600 font-semibold">In Stock</p>
                        </div>
                    </div>
                `;
  });
}

function openProductModal(id) {
  selectedProduct = allProducts.find((p) => p.id === id);
  currentQuantity = 1;
  currentRating = 0;

  document.getElementById('modalTitle').textContent = selectedProduct.name;
  document.getElementById('mainImg').textContent = selectedProduct.image;
  document.getElementById('thumb0').textContent = selectedProduct.image;
  document.getElementById('thumb1').textContent = selectedProduct.image;

  document.getElementById('productCategory').textContent =
    selectedProduct.category;
  document.getElementById('productName').textContent = selectedProduct.name;

  const rating =
    '★'.repeat(selectedProduct.rating) + '☆'.repeat(5 - selectedProduct.rating);
  document.getElementById(
    'productRating'
  ).innerHTML = `<span class="text-yellow-400">${rating}</span>`;
  document.getElementById(
    'productRatingText'
  ).textContent = `${selectedProduct.rating}.0/5`;
  document.getElementById(
    'productReviews'
  ).textContent = `(${selectedProduct.reviews} reviews)`;

  const disc = Math.round(
    ((selectedProduct.price - selectedProduct.discountPrice) /
      selectedProduct.price) *
      100
  );
  document.getElementById(
    'productPrice'
  ).textContent = `₹${selectedProduct.discountPrice}`;
  document.getElementById(
    'productOriginalPrice'
  ).textContent = `₹${selectedProduct.price}`;
  document.getElementById('productDiscount').textContent = `You save ₹${
    selectedProduct.price - selectedProduct.discountPrice
  }`;

  document.getElementById('productDescription').textContent =
    selectedProduct.description;
  document.getElementById('productStock').textContent = `${
    Math.floor(Math.random() * 50) + 20
  } items in stock`;
  document.getElementById('quantityDisplay').textContent = '1';

  const isInWishlist = wishlist.some((item) => item.id === selectedProduct.id);
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (isInWishlist) {
    wishlistBtn.classList.add('bg-red-500', 'text-white');
  } else {
    wishlistBtn.classList.remove('bg-red-500', 'text-white');
  }

  document.getElementById('relatedCategory').textContent =
    selectedProduct.category;
  showRelatedProducts(selectedProduct.category, selectedProduct.id);
  showReviews();

  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

function changeMainImage(index) {
  document.getElementById('mainImg').textContent = selectedProduct.emoji;
}

function increaseQuantity() {
  currentQuantity++;
  document.getElementById('quantityDisplay').textContent = currentQuantity;
}

function decreaseQuantity() {
  if (currentQuantity > 1) {
    currentQuantity--;
    document.getElementById('quantityDisplay').textContent = currentQuantity;
  }
}

function showRelatedProducts(category, excludeId) {
  const related = allProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, 4);

  const grid = document.getElementById('relatedProductsGrid');
  grid.innerHTML = '';

  related.forEach((p) => {
    const disc = Math.round(((p.price - p.discountPrice) / p.price) * 100);
    const rating = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);

    grid.innerHTML += `
                    <div class="bg-white rounded-lg shadow-soft overflow-hidden product-card cursor-pointer" onclick="openProductModal(${p.id})">
                        <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                            <img src="${p.image}">
                            <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">-${disc}%</div>
                        </div>
                        <div class="p-4">
                            <p class="text-xs text-gray-500 uppercase mb-1">${p.category}</p>
                            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${p.name}</h3>
                            <div class="flex items-center gap-1 mb-2">
                                <span class="text-yellow-400 text-sm">${rating}</span>
                                <span class="text-xs text-gray-500">(${p.reviews})</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-bold text-orange-500">₹${p.discountPrice}</span>
                                <span class="text-sm text-gray-500 line-through">₹${p.price}</span>
                            </div>
                        </div>
                    </div>
                `;
  });
}

function setRating(rating) {
  currentRating = rating;
  const stars = document.querySelectorAll('#ratingStars button');
  stars.forEach((star, idx) => {
    if (idx < rating) {
      star.classList.add('text-yellow-400');
      star.classList.remove('text-gray-300');
    } else {
      star.classList.remove('text-yellow-400');
      star.classList.add('text-gray-300');
    }
  });
}

function submitReview() {
  if (!currentUser) {
    showToast('Login to submit review', 'error');
    return;
  }

  const reviewText = document.getElementById('reviewText').value;
  if (!reviewText || currentRating === 0) {
    showToast('Fill rating and review', 'error');
    return;
  }

  if (!userReviews[selectedProduct.id]) {
    userReviews[selectedProduct.id] = [];
  }

  userReviews[selectedProduct.id].push({
    user: currentUser.firstName,
    rating: currentRating,
    text: reviewText,
    date: new Date().toLocaleDateString(),
  });

  document.getElementById('reviewText').value = '';
  setRating(0);
  showReviews();
  showToast('Review submitted! 🎉');
  saveToStorage();
}

function showReviews() {
  const container = document.getElementById('reviewsContainer');
  const productReviews = userReviews[selectedProduct.id] || [];

  const defaultReviews = [
    {
      user: 'Rajesh Kumar',
      rating: 5,
      text: 'Excellent quality and fast delivery!',
      date: '2 days ago',
    },
    {
      user: 'Priya Singh',
      rating: 4,
      text: 'Good product, worth the price. Highly recommend!',
      date: '1 week ago',
    },
  ];

  const allReviews = [...defaultReviews, ...productReviews];

  container.innerHTML = allReviews
    .map(
      (review) => `
                <div class="review-card">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-semibold text-gray-900">${
                          review.user
                        }</h4>
                        <span class="text-xs text-gray-500">${
                          review.date
                        }</span>
                    </div>
                    <div class="flex mb-2">
                        <span class="text-yellow-400 text-sm">${'★'.repeat(
                          review.rating
                        )}${'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p class="text-gray-700 text-sm">${review.text}</p>
                </div>
            `
    )
    .join('');
}

function toggleWishlist() {
  if (!currentUser) {
    goToPage('login');
    showToast('Login to add wishlist', 'error');
    return;
  }

  const existing = wishlist.find((item) => item.id === selectedProduct.id);
  if (existing) {
    wishlist = wishlist.filter((item) => item.id !== selectedProduct.id);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(selectedProduct);
    showToast('Added to wishlist!');
  }

  const btn = document.getElementById('wishlistBtn');
  if (wishlist.some((item) => item.id === selectedProduct.id)) {
    btn.classList.add('bg-red-500', 'text-white');
  } else {
    btn.classList.remove('bg-red-500', 'text-white');
  }

  updateWishlistUI();
  saveToStorage();
}

function updateWishlistUI() {
  const count = document.getElementById('wishlistCount');
  if (wishlist.length > 0) {
    count.textContent = wishlist.length;
    count.classList.remove('hidden');
  } else {
    count.classList.add('hidden');
  }

  const empty = document.getElementById('wishlistEmpty');
  const grid = document.getElementById('wishlistGrid');

  if (wishlist.length === 0) {
    empty.classList.remove('hidden');
    grid.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    grid.classList.remove('hidden');

    let html = '';
    wishlist.forEach((p) => {
      const disc = Math.round(((p.price - p.discountPrice) / p.price) * 100);
      const rating = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);

      html += `
                        <div class="bg-white rounded-lg shadow-soft overflow-hidden product-card" onclick="openProductModal(${p.id})">
                            <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                                <img src="${p.image}">
                                <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">-${disc}%</div>
                            </div>
                            <div class="p-4">
                                <p class="text-xs text-gray-500 uppercase mb-1">${p.category}</p>
                                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${p.name}</h3>
                                <div class="flex items-center gap-1 mb-2">
                                    <span class="text-yellow-400 text-sm">${rating}</span>
                                    <span class="text-xs text-gray-500">(${p.reviews})</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-lg font-bold text-orange-500">₹${p.discountPrice}</span>
                                    <span class="text-sm text-gray-500 line-through">₹${p.price}</span>
                                </div>
                            </div>
                        </div>
                    `;
    });
    grid.innerHTML = html;
  }
}

function addToCart() {
  if (!currentUser) {
    goToPage('login');
    showToast('Login required', 'error');
    closeProductModal();
    return;
  }

  for (let i = 0; i < currentQuantity; i++) {
    const existing = cart.find((item) => item.id === selectedProduct.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...selectedProduct, quantity: 1 });
    }
  }
  updateCart();
  showToast('Added to cart!');
  closeProductModal();
  saveToStorage();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartSummary.classList.add('hidden');
    document.getElementById('cartCount').classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    document.getElementById('cartCount').classList.remove('hidden');
    document.getElementById('cartCount').textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.forEach((item) => {
      cartItems.innerHTML += `
                        <div class="flex gap-3 pb-3 border-b">
                            <div class="w-16 h-16 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl">${item.image}</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-sm text-gray-900 line-clamp-1">${item.name}</h4>
                                <p class="text-sm text-orange-500 font-bold">₹${item.discountPrice}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <button onclick="updateCartQuantity(${item.id}, -1)" class="text-gray-600 px-2 py-1">−</button>
                                    <span class="text-sm font-semibold">${item.quantity}</span>
                                    <button onclick="updateCartQuantity(${item.id}, 1)" class="text-gray-600 px-2 py-1">+</button>
                                    <button onclick="removeFromCart(${item.id})" class="ml-auto text-red-500 text-xs"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
    });
  }

  updateCartSummary();
}

function updateCartQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
  saveToStorage();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
  showToast('Removed from cart');
  saveToStorage();
}

function clearCart() {
  cart = [];
  updateCart();
  showToast('Cart cleared');
  saveToStorage();
}

function updateCartSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  document.getElementById('subtotal').textContent = `₹${subtotal}`;
  document.getElementById('tax').textContent = `₹${Math.round(tax)}`;
  document.getElementById('shipping').textContent =
    shipping === 0 ? 'FREE' : `₹${shipping}`;
  document.getElementById('total').textContent = `₹${Math.round(total)}`;

  document.getElementById('checkoutSubtotal').textContent = `₹${subtotal}`;
  document.getElementById('checkoutTax').textContent = `₹${Math.round(tax)}`;
  document.getElementById('checkoutShipping').textContent =
    shipping === 0 ? 'FREE' : `₹${shipping}`;
  document.getElementById('checkoutTotal').textContent = `₹${Math.round(
    total
  )}`;

  let checkoutItemsHTML = '';
  cart.forEach((item) => {
    checkoutItemsHTML += `
                    <div class="flex justify-between text-sm">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${item.discountPrice * item.quantity}</span>
                    </div>
                `;
  });
  document.getElementById('checkoutItems').innerHTML = checkoutItemsHTML;
}

function proceedToCheckout() {
  if (cart.length === 0) {
    showToast('Add items to cart', 'error');
    return;
  }
  toggleCart();
  document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('active');
}

function goToPayment() {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;

  if (!fullName || !email || !phone || !address) {
    showToast('Fill all fields', 'error');
    return;
  }

  document.getElementById('checkoutForm').classList.add('hidden');
  document.getElementById('paymentSection').classList.remove('hidden');
  document
    .getElementById('step1')
    .classList.remove('bg-orange-500', 'text-white');
  document
    .getElementById('step1')
    .classList.add('bg-gray-300', 'text-gray-600');
  document
    .getElementById('step2')
    .classList.remove('bg-gray-300', 'text-gray-600');
  document.getElementById('step2').classList.add('bg-orange-500', 'text-white');
}

function placeOrder() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const order = {
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toLocaleDateString(),
    items: [...cart],
    total: Math.round(total),
    status: 'pending',
    address: document.getElementById('address').value,
    phone: document.getElementById('phone').value,
    timeline: [
      {
        step: 'Order Placed',
        date: new Date().toLocaleDateString(),
        completed: true,
        image: '✅',
      },
      { step: 'Processing', date: 'Soon', completed: false, emoji: '⏳' },
      { step: 'Shipped', date: 'Soon', completed: false, emoji: '📦' },
      { step: 'Delivered', date: 'Soon', completed: false, emoji: '🚚' },
    ],
  };

  orders.push(order);
  showToast('Order placed! 🎉');

  setTimeout(() => {
    closeCheckoutModal();
    cart = [];
    updateCart();
    document.getElementById('checkoutForm').classList.remove('hidden');
    document.getElementById('paymentSection').classList.add('hidden');
    document
      .getElementById('step1')
      .classList.add('bg-orange-500', 'text-white');
    document
      .getElementById('step1')
      .classList.remove('bg-gray-300', 'text-gray-600');
    document
      .getElementById('step2')
      .classList.add('bg-gray-300', 'text-gray-600');
    document
      .getElementById('step2')
      .classList.remove('bg-orange-500', 'text-white');
    clearCheckoutForm();
    saveToStorage();
    updateOrdersPage();
  }, 1500);
}

function clearCheckoutForm() {
  document.getElementById('fullName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('address').value = '';
  document.getElementById('city').value = '';
  document.getElementById('state').value = '';
  document.getElementById('pincode').value = '';
}

function updateOrdersPage() {
  const empty = document.getElementById('ordersEmpty');
  const list = document.getElementById('ordersList');

  if (orders.length === 0) {
    empty.classList.remove('hidden');
    list.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    list.classList.remove('hidden');

    let html = '';
    orders.forEach((order) => {
      html += `
                        <div class="bg-white rounded-lg shadow-soft p-6">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <h3 class="font-bold text-lg">Order #${
                                      order.id
                                    }</h3>
                                    <p class="text-sm text-gray-500">${
                                      order.date
                                    }</p>
                                </div>
                                <div class="text-right">
                                    <span class="status-badge status-${
                                      order.status
                                    }">${order.status.toUpperCase()}</span>
                                    <p class="text-2xl font-bold text-orange-500 mt-2">₹${
                                      order.total
                                    }</p>
                                </div>
                            </div>

                            <div class="mb-4 pb-4 border-b">
                                <h4 class="font-semibold mb-2">Items:</h4>
                                ${order.items
                                  .map(
                                    (item) =>
                                      `<p class="text-sm text-gray-600">${item.image} ${item.name} × ${item.quantity}</p>`
                                  )
                                  .join('')}
                            </div>

                            <div class="mb-4">
                                <h4 class="font-semibold mb-3">Order Timeline:</h4>
                                <div class="space-y-3">
                                    ${order.timeline
                                      .map(
                                        (step, idx) => `
                                        <div class="flex gap-3">
                                            <div class="w-8 h-8 rounded-full ${
                                              step.completed
                                                ? 'bg-green-500'
                                                : 'bg-gray-300'
                                            } text-white flex items-center justify-center text-sm font-bold">${
                                          step.completed ? '✓' : idx + 1
                                        }</div>
                                            <div>
                                                <p class="font-semibold text-sm">${
                                                  step.step
                                                }</p>
                                                <p class="text-xs text-gray-500">${
                                                  step.date
                                                }</p>
                                            </div>
                                        </div>
                                    `
                                      )
                                      .join('')}
                                </div>
                            </div>

                            <div class="bg-gray-50 p-3 rounded text-sm">
                                <p><strong>Delivery Address:</strong></p>
                                <p class="text-gray-600">${order.address}</p>
                                <p class="text-gray-600">📱 ${order.phone}</p>
                            </div>
                        </div>
                    `;
    });
    list.innerHTML = html;
  }
}

function nextBanner() {
  currentBanner = (currentBanner + 1) % 3;
  updateBanner();
}

function prevBanner() {
  currentBanner = (currentBanner - 1 + 3) % 3;
  updateBanner();
}

function updateBanner() {
  const carousel = document.getElementById('carouselInner');
  carousel.style.transform = `translateX(-${currentBanner * 100}%)`;

  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (i === currentBanner) {
      dot.classList.add('bg-white');
      dot.classList.remove('bg-white/50');
    } else {
      dot.classList.remove('bg-white');
      dot.classList.add('bg-white/50');
    }
  }
}

function sortProducts() {
  const sortValue = document.getElementById('sortSelect').value;
  let sorted = [...allProducts];

  switch (sortValue) {
    case 'price-low':
      sorted.sort((a, b) => a.discountPrice - b.discountPrice);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.discountPrice - a.discountPrice);
      break;
  }
  renderProducts(sorted);
}

function sortCategoryProducts() {
  const sortValue = document.getElementById('categorySortSelect').value;
  let sorted = [...allProducts].filter((p) => p.category === currentCategory);

  switch (sortValue) {
    case 'price-low':
      sorted.sort((a, b) => a.discountPrice - b.discountPrice);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.discountPrice - a.discountPrice);
      break;
  }
  renderCategoryProducts(sorted);
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.style.background = type === 'error' ? '#ef4444' : '#10b981';

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2000);
}

function saveToStorage() {
  localStorage.setItem('ecommerce_user', JSON.stringify(currentUser));
  localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
  localStorage.setItem('ecommerce_wishlist', JSON.stringify(wishlist));
  localStorage.setItem('ecommerce_orders', JSON.stringify(orders));
  localStorage.setItem('ecommerce_reviews', JSON.stringify(userReviews));
}

function loadFromStorage() {
  const user = localStorage.getItem('ecommerce_user');
  const cartData = localStorage.getItem('ecommerce_cart');
  const wishlistData = localStorage.getItem('ecommerce_wishlist');
  const ordersData = localStorage.getItem('ecommerce_orders');
  const reviewsData = localStorage.getItem('ecommerce_reviews');

  if (user) currentUser = JSON.parse(user);
  if (cartData) cart = JSON.parse(cartData);
  if (wishlistData) wishlist = JSON.parse(wishlistData);
  if (ordersData) orders = JSON.parse(ordersData);
  if (reviewsData) userReviews = JSON.parse(reviewsData);

  updateProfileMenu();
  updateCart();
  updateWishlistUI();
  updateOrdersPage();
}

/* ================= IMAGE FIX PATCH ================= */

// Fix broken <img> tags created by template strings
function fixProductImages() {
  document.querySelectorAll('img').forEach((img) => {
    // Agar src empty ya broken ho
    if (!img.getAttribute('src')) return;

    // Auto add alt
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', 'product image');
    }

    // Error fallback
    img.onerror = function () {
      this.src = 'images/placeholder.jpg';
    };
  });
}

// Override render functions AFTER original render
const originalRenderProducts = renderProducts;
renderProducts = function (products) {
  originalRenderProducts(products);
  setTimeout(fixProductImages, 0);
};

const originalRenderCategoryProducts = renderCategoryProducts;
renderCategoryProducts = function (products) {
  originalRenderCategoryProducts(products);
  setTimeout(fixProductImages, 0);
};

const originalShowRelatedProducts = showRelatedProducts;
showRelatedProducts = function (category, excludeId) {
  originalShowRelatedProducts(category, excludeId);
  setTimeout(fixProductImages, 0);
};

// Modal image fix
const originalOpenProductModal = openProductModal;
openProductModal = function (id) {
  originalOpenProductModal(id);

  const mainImg = document.getElementById('mainImg');
  if (mainImg && selectedProduct?.image) {
    mainImg.src = selectedProduct.image;
    mainImg.onerror = () => (mainImg.src = 'images/placeholder.jpg');
  }

  document.querySelectorAll("[id^='thumb']").forEach((thumb) => {
    thumb.src = selectedProduct.image;
    thumb.onerror = () => (thumb.src = 'images/placeholder.jpg');
  });
};

// Run once on load
window.addEventListener('load', fixProductImages);

/* ================= END IMAGE FIX PATCH ================= */
