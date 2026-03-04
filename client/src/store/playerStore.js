import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
      currentTrack: null,
      queue: [],
      isPlaying: false,
      volume: 0.7,
      currentTime: 0,
      duration: 0,
      isShuffled: false,
      repeatMode: 'off', // 'off', 'all', 'one'
      
      setCurrentTrack: (track) => set({ currentTrack: track }),
      
      setQueue: (tracks) => set({ queue: tracks }),
      
      addToQueue: (track) => set((state) => ({
        queue: [...state.queue, track]
      })),
      
      removeFromQueue: (index) => set((state) => ({
        queue: state.queue.filter((_, i) => i !== index)
      })),
      
      playNext: () => {
        const state = get();
        const currentIndex = state.queue.findIndex(
          (t) => t.id === state.currentTrack?.id
        );
        
        if (currentIndex < state.queue.length - 1) {
          set({ currentTrack: state.queue[currentIndex + 1] });
        } else if (state.repeatMode === 'all') {
          set({ currentTrack: state.queue[0] });
        }
      },
      
      playPrevious: () => {
        const state = get();
        const currentIndex = state.queue.findIndex(
          (t) => t.id === state.currentTrack?.id
        );
        
        if (currentIndex > 0) {
          set({ currentTrack: state.queue[currentIndex - 1] });
        }
      },
      
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      
      setVolume: (volume) => set({ volume }),
      
      setCurrentTime: (time) => set({ currentTime: time }),
      
      setDuration: (duration) => set({ duration }),
      
      toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
      
      cycleRepeat: () => set((state) => ({
        repeatMode: state.repeatMode === 'off' 
          ? 'all' 
          : state.repeatMode === 'all' 
          ? 'one' 
          : 'off'
      })),
    })
);

export default usePlayerStore;
