import React, { useState, useEffect } from 'react';
import { Home, Star, User, ArrowLeft, ShoppingBag, Check, Clock, Heart, MapPin, Zap, Gift } from 'lucide-react';

type Screen = 'home' | 'borrow' | 'success' | 'favorites' | 'profile';

interface AppState {
  points: number;
  bagsUsed: number;
  bagsReturned: number;
  timeRemaining: number;
}

interface FavoriteLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  available: number;
  total: number;
  isOpen: boolean;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([
    {
      id: '1',
      name: 'Green Market Downtown',
      address: '123 Main Street',
      distance: '0.2 km',
      available: 8,
      total: 12,
      isOpen: true
    },
    {
      id: '2',
      name: 'EcoMart Plaza',
      address: '456 Oak Avenue',
      distance: '0.5 km',
      available: 15,
      total: 20,
      isOpen: true
    },
    {
      id: '3',
      name: 'Sustainable Store',
      address: '789 Pine Road',
      distance: '0.8 km',
      available: 0,
      total: 10,
      isOpen: false
    }
  ]);
  
  const [appState, setAppState] = useState<AppState>({
    points: 35,
    bagsUsed: 15,
    bagsReturned: 12,
    timeRemaining: 7199
  });

  // Smooth screen transition
  const navigateToScreen = (screen: Screen) => {
    if (screen === currentScreen) return;
    
    setIsTransitioning(true);
    setPreviousScreen(currentScreen);
    
    setTimeout(() => {
      setCurrentScreen(screen);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  // Timer for countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentScreen === 'success' && appState.timeRemaining > 0) {
      interval = setInterval(() => {
        setAppState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentScreen, appState.timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBorrow = () => {
    navigateToScreen('success');
    setAppState(prev => ({
      ...prev,
      points: prev.points + 5,
      bagsUsed: prev.bagsUsed + 1,
      timeRemaining: 7199
    }));
  };

  const handleReturn = () => {
    navigateToScreen('home');
    setAppState(prev => ({
      ...prev,
      points: prev.points + 10,
      bagsReturned: prev.bagsReturned + 1
    }));
  };

  const redeemReward = (pointsCost: number) => {
    if (appState.points >= pointsCost) {
      setAppState(prev => ({
        ...prev,
        points: prev.points - pointsCost
      }));
    }
  };

  const toggleFavorite = (locationId: string) => {
    setFavoriteLocations(prev => 
      prev.map(location => 
        location.id === locationId 
          ? { ...location, isFavorited: !location.isFavorited }
          : location
      )
    );
  };

  const renderHeader = () => {
    const showBackButton = currentScreen !== 'home';
    const getTitle = () => {
      switch (currentScreen) {
        case 'borrow': return 'Borrow a Bag';
        case 'success': return 'Success!';
        case 'favorites': return 'Favorites';
        case 'profile': return 'Profile';
        default: return '';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 relative z-10">
        <div className="flex items-center">
          {showBackButton ? (
            <button 
              onClick={() => navigateToScreen('home')}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 mr-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <h1 className="text-xl font-bold text-gray-900">EcoStep</h1>
          )}
          {showBackButton && (
            <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>
          )}
        </div>
        {currentScreen === 'home' && (
          <div className="flex items-center animate-pulse">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-emerald-600 font-semibold">{appState.points} pts</span>
          </div>
        )}
      </div>
    );
  };

  const renderBottomNav = () => {
    if (currentScreen === 'borrow' || currentScreen === 'success') return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 backdrop-blur-sm bg-white/95">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={() => navigateToScreen('home')}
            className={`p-3 rounded-xl transition-all duration-300 transform ${
              currentScreen === 'home' 
                ? 'text-emerald-600 bg-emerald-50 scale-110' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigateToScreen('favorites')}
            className={`p-3 rounded-xl transition-all duration-300 transform ${
              currentScreen === 'favorites' 
                ? 'text-emerald-600 bg-emerald-50 scale-110' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Star className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigateToScreen('profile')}
            className={`p-3 rounded-xl transition-all duration-300 transform ${
              currentScreen === 'profile' 
                ? 'text-emerald-600 bg-emerald-50 scale-110' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse">
        <ShoppingBag className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Borrow a Bag</h2>
      
      <button 
        onClick={() => navigateToScreen('borrow')}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg mb-12 active:scale-95"
      >
        Get Started
      </button>
      
      <div className="flex space-x-16">
        <div className="text-center transform hover:scale-105 transition-all duration-200">
          <div className="text-3xl font-bold text-emerald-600 mb-1">{appState.bagsUsed}</div>
          <div className="text-gray-600">Bags Used</div>
        </div>
        <div className="text-center transform hover:scale-105 transition-all duration-200">
          <div className="text-3xl font-bold text-emerald-600 mb-1">{appState.bagsReturned}</div>
          <div className="text-gray-600">Returned</div>
        </div>
      </div>
    </div>
  );

  const renderBorrow = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-48 h-48 border-4 border-emerald-500 rounded-3xl flex items-center justify-center mb-8 bg-white shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="text-center">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-white'} rounded-sm transition-all duration-200 hover:scale-110`}
              ></div>
            ))}
          </div>
          <div className="text-emerald-600 font-bold text-lg">QR</div>
        </div>
      </div>
      
      <p className="text-gray-700 text-center mb-8 text-lg">Scan QR code on the kiosk</p>
      
      <button 
        onClick={handleBorrow}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg active:scale-95"
      >
        Confirm Borrow
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
        <Check className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Bag Borrowed</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Successfully</h3>
      
      <p className="text-gray-600 text-center mb-6">
        Return by 2:00 PM to earn<br />bonus points
      </p>
      
      <div className="flex items-center text-orange-500 font-bold text-xl mb-12 animate-pulse">
        <Clock className="w-5 h-5 mr-2" />
        {formatTime(appState.timeRemaining)}
      </div>
      
      <button 
        onClick={handleReturn}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg active:scale-95"
      >
        Continue Shopping
      </button>
    </div>
  );

  const renderFavorites = () => (
    <div className="flex-1 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Favorite Locations</h2>
        <p className="text-gray-600">Your saved bag borrowing spots</p>
      </div>
      
      <div className="space-y-4">
        {favoriteLocations.map((location, index) => (
          <div 
            key={location.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:scale-102 transition-all duration-300 hover:shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-900 mr-2">{location.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${location.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{location.address}</span>
                </div>
                <div className="text-sm text-gray-500">{location.distance} away</div>
              </div>
              <button 
                onClick={() => toggleFavorite(location.id)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
              >
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 text-emerald-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {location.available}/{location.total} available
                </span>
              </div>
              <button 
                disabled={!location.isOpen || location.available === 0}
                className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform ${
                  location.isOpen && location.available > 0
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {location.isOpen ? (location.available > 0 ? 'Borrow' : 'Full') : 'Closed'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200">
          + Add New Location
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 pb-20">
      {/* Points Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Points</h2>
        <div className="text-5xl font-bold text-emerald-600 mb-2 animate-pulse">{appState.points}</div>
        <p className="text-gray-600">Redeem your points for rewards</p>
      </div>
      
      {/* Rewards Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-emerald-600" />
          Available Rewards
        </h3>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between transform hover:scale-102 transition-all duration-300">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">5% Discount</h4>
              <p className="text-sm text-gray-600">On your next purchase</p>
            </div>
            <button 
              onClick={() => redeemReward(50)}
              disabled={appState.points < 50}
              className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform ${
                appState.points >= 50 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              50 pts
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between transform hover:scale-102 transition-all duration-300">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Free Coffee</h4>
              <p className="text-sm text-gray-600">At partner cafes</p>
            </div>
            <button 
              onClick={() => redeemReward(30)}
              disabled={appState.points < 30}
              className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform ${
                appState.points >= 30 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              30 pts
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-emerald-600" />
          Your Impact
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600 mb-1">{appState.bagsUsed}</div>
            <div className="text-sm text-gray-600">Bags Used</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">{appState.bagsReturned}</div>
            <div className="text-sm text-gray-600">Returned</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(appState.bagsUsed * 0.05 * 100) / 100}</div>
            <div className="text-sm text-gray-600">kg CO₂ Saved</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600 mb-1">{appState.bagsUsed * 2}</div>
            <div className="text-sm text-gray-600">Plastic Bags Avoided</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const baseClasses = "transition-all duration-300 ease-in-out";
    const transitionClasses = isTransitioning 
      ? "opacity-0 transform scale-95" 
      : "opacity-100 transform scale-100";

    const content = (() => {
      switch (currentScreen) {
        case 'borrow': return renderBorrow();
        case 'success': return renderSuccess();
        case 'favorites': return renderFavorites();
        case 'profile': return renderProfile();
        default: return renderHome();
      }
    })();

    return (
      <div className={`${baseClasses} ${transitionClasses}`}>
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Frame */}
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen flex flex-col relative overflow-hidden">
        {/* Status Bar */}
        <div className="h-6 bg-gray-800 rounded-t-3xl flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Header */}
        {renderHeader()}
        
        {/* Content */}
        <div className="flex-1 relative">
          {renderContent()}
        </div>
        
        {/* Bottom Navigation */}
        {renderBottomNav()}
        
        {/* Home Indicator */}
        <div className="h-6 bg-white rounded-b-3xl flex items-center justify-center">
          <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default App;