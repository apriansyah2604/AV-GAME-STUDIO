'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { Users, RefreshCw, Trash2, Search, CheckSquare, SquareX, Send, UserPlus, ExternalLink } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

type Friend = {
  id: number;
  name: string;
  displayName: string;
  isOnline: boolean;
  presenceType: 'offline' | 'online' | 'in_game' | 'in_studio';
  lastLocation: string | null;
};

type SearchResult = {
  id: number;
  name: string;
  displayName: string;
  hasVerifiedBadge: boolean;
};

export default function FriendsPanel({ connectionId }: { connectionId: string }) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirm, setConfirm] = useState<{ open: boolean; friends: Friend[] }>({ open: false, friends: [] });
  const [unfriendLoading, setUnfriendLoading] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessages, setSendingMessages] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const { addToast } = useToast();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/friends?connectionId=${connectionId}&limit=1000`);
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message || 'Gagal mengambil daftar teman';
        addToast(msg, 'error');
        return;
      }
      setFriends(json.data || []);
      setSelectedIds([]);
    } catch (error) {
      console.error('[v0] Error fetching friends:', error);
      addToast('Gagal mengambil daftar teman', 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message || 'Gagal mencari pengguna';
        addToast(msg, 'error');
        return;
      }
      setSearchResults(json.data?.results || []);
    } catch (error) {
      console.error('[v0] Error searching users:', error);
      addToast('Gagal mencari pengguna', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const openRobloxProfile = (userId: number) => {
    window.open(`https://www.roblox.com/users/${userId}/profile`, '_blank');
  };

  useEffect(() => {
    setFriends([]);
    setQuery('');
    setSelectedIds([]);
    setSearchResults([]);
    setShowSearch(false);
    fetchFriends();
  }, [connectionId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(f => {
      const name = (f.name || '').toLowerCase();
      const display = (f.displayName || '').toLowerCase();
      const id = String(f.id);
      return name.includes(q) || display.includes(q) || id.includes(q);
    });
  }, [friends, query]);

  const selectedFriends = useMemo(
    () => friends.filter(friend => selectedIds.includes(friend.id)),
    [friends, selectedIds]
  );

  const filteredSelectedCount = filtered.filter(friend => selectedIds.includes(friend.id)).length;

  const toggleSelection = (friendId: number) => {
    setSelectedIds(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const selectAllFiltered = () => {
    setSelectedIds(prev => {
      const merged = new Set(prev);
      filtered.forEach(friend => merged.add(friend.id));
      return Array.from(merged);
    });
  };

  const clearSelection = () => setSelectedIds([]);

  const confirmUnfriend = (friendsToDelete: Friend[]) =>
    setConfirm({ open: true, friends: friendsToDelete });

  const doUnfriend = async () => {
    if (confirm.friends.length === 0) return;
    setUnfriendLoading(true);
    try {
      const res = await fetch('/api/friends/unfriend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId,
          ...(confirm.friends.length === 1
            ? { targetUserId: confirm.friends[0].id }
            : { targetUserIds: confirm.friends.map(friend => friend.id) }),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message || 'Gagal menghapus pertemanan';
        addToast(msg, 'error');
        return;
      }

      const successIds = new Set(
        (json?.data?.results || [])
          .filter((result: { success: boolean; targetUserId: string }) => result.success)
          .map((result: { targetUserId: string }) => Number(result.targetUserId))
      );

      setFriends(prev => prev.filter(friend => !successIds.has(friend.id)));
      setSelectedIds(prev => prev.filter(id => !successIds.has(id)));

      const successCount = json?.data?.successCount ?? successIds.size;
      const failedCount = json?.data?.failedCount ?? 0;
      if (failedCount > 0) {
        addToast(`${successCount} teman dihapus, ${failedCount} gagal`, 'warning');
      } else if (successCount > 1) {
        addToast(`${successCount} teman berhasil dihapus`, 'success');
      } else {
        const onlyFriend = confirm.friends[0];
        addToast(`Pertemanan dihapus: ${onlyFriend.displayName || onlyFriend.name}`, 'success');
      }
    } catch (error) {
      console.error('[v0] Error unfriending:', error);
      addToast('Gagal menghapus pertemanan', 'error');
    } finally {
      setUnfriendLoading(false);
      setConfirm({ open: false, friends: [] });
    }
  };

  const sendMassMessage = async () => {
    if (selectedFriends.length === 0) {
      addToast('Pilih minimal satu teman', 'warning');
      return;
    }

    if (!messageBody.trim()) {
      addToast('Isi pesan wajib diisi', 'warning');
      return;
    }

    setSendingMessages(true);
    setSendProgress({ current: 0, total: selectedFriends.length });

    const successList: Friend[] = [];
    const failedList: { friend: Friend; error: string }[] = [];

    for (let i = 0; i < selectedFriends.length; i++) {
      const friend = selectedFriends[i];
      try {
        console.log(`[FriendsPanel] Sending to ${friend.name} (${i + 1}/${selectedFriends.length})`);
        
        const res = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connectionId,
            recipientId: friend.id,
            message: messageBody,
          }),
        });

        const json = await res.json();
        console.log('[FriendsPanel] Response:', json);

        if (res.ok && json.success) {
          successList.push(friend);
        } else {
          failedList.push({ friend, error: json.error?.message || 'Gagal' });
        }
      } catch (error) {
        console.error(`[FriendsPanel] Error sending to ${friend.name}:`, error);
        failedList.push({ friend, error: 'Gagal mengirim' });
      } finally {
        setSendProgress({ current: i + 1, total: selectedFriends.length });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik untuk menghindari rate limit
      }
    }

    setSendingMessages(false);
    
    if (successList.length > 0) {
      addToast(`Berhasil mengirim pesan ke ${successList.length} teman!`, 'success');
    }
    
    if (failedList.length > 0) {
      addToast(`Gagal mengirim ke ${failedList.length} teman: ${failedList.map(f => f.friend.name).join(', ')}`, 'error', 8000);
    }
  };

  const getPresenceLabel = (friend: Friend) => {
    if (friend.presenceType === 'in_game') return 'Sedang main';
    if (friend.presenceType === 'in_studio') return 'Di Studio';
    if (friend.presenceType === 'online') return 'Online';
    return 'Offline';
  };

  const getPresenceClasses = (friend: Friend) => {
    if (friend.presenceType === 'in_game') return 'bg-green-100 text-green-700 border-green-200';
    if (friend.presenceType === 'in_studio') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (friend.presenceType === 'online') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-2xl font-semibold">Pertemanan</h2>
          <span className="text-sm text-muted-foreground">({friends.length})</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSearch(!showSearch)}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {showSearch ? 'Tutup Cari' : 'Cari Pengguna'}
          </Button>
          <Button
            variant="outline"
            onClick={fetchFriends}
            disabled={loading || unfriendLoading}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-muted/40">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold">Cari Pengguna Roblox</h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchUsers();
                }}
                placeholder="Masukkan nama pengguna Roblox..."
                className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <Button
              onClick={searchUsers}
              disabled={searchLoading || !searchQuery.trim()}
              className="gap-2"
            >
              {searchLoading ? 'Mencari...' : 'Cari'}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-medium truncate">
                        {user.displayName || user.name}
                      </p>
                      {user.hasVerifiedBadge && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      @{user.name} • {user.id}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => openRobloxProfile(user.id)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Lihat Profil
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari teman (nama / display name / userId)"
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={selectAllFiltered}
          disabled={loading || unfriendLoading || filtered.length === 0 || filteredSelectedCount === filtered.length}
          className="gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          Pilih Semua
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          disabled={loading || unfriendLoading || selectedIds.length === 0}
          className="gap-2"
        >
          <SquareX className="w-4 h-4" />
          Batal Pilih
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => confirmUnfriend(selectedFriends)}
          disabled={loading || unfriendLoading || selectedFriends.length === 0}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Hapus Terpilih ({selectedIds.length})
        </Button>
      </div>

      <div className="mb-6 p-4 rounded-lg border border-blue-400 bg-blue-50 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-blue-800">💬 Kirim Pesan Otomatis</h3>
            <p className="text-sm text-blue-700">
              Kirim pesan secara otomatis ke semua teman yang dipilih.
            </p>
          </div>
          <span className="text-sm text-blue-700">
            Penerima: {selectedFriends.length}
          </span>
        </div>
        
        <textarea
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Tulis isi pesan di sini..."
          maxLength={1000}
          rows={5}
          disabled={sendingMessages}
          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-foreground resize-y disabled:opacity-50"
        />
        
        {sendingMessages && (
          <div className="space-y-2">
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-700 text-center">
              Mengirim pesan... {sendProgress.current}/{sendProgress.total}
            </p>
          </div>
        )}
        
        {selectedFriends.length > 0 && messageBody.trim() && !sendingMessages && (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={sendMassMessage}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
              Kirim Pesan ke {selectedFriends.length} Teman
            </Button>
            
            <div className="flex-1" />
            
            {selectedFriends.map((friend) => (
              <Button
                key={friend.id}
                variant="outline"
                onClick={() => {
                  const profileUrl = `https://www.roblox.com/users/${friend.id}/profile`;
                  navigator.clipboard.writeText(messageBody);
                  addToast(`Pesan disalin untuk ${friend.displayName || friend.name}!`, 'success');
                  window.open(profileUrl, '_blank');
                }}
                className="gap-1"
                size="sm"
              >
                <ExternalLink className="w-3 h-3" />
                {friend.displayName || friend.name}
              </Button>
            ))}
          </div>
        )}
        
        {selectedFriends.length === 0 && (
          <p className="text-xs text-blue-600">
            Centang teman di bawah untuk mengirim pesan.
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {friends.length === 0 ? 'Belum ada teman atau tidak bisa diakses.' : 'Tidak ada hasil.'}
        </p>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
          {filtered.map(friend => (
            <div
              key={friend.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-background"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(friend.id)}
                  onChange={() => toggleSelection(friend.id)}
                  disabled={unfriendLoading}
                  className="h-4 w-4 rounded border-border"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="font-medium truncate">
                      {friend.displayName || friend.name}
                    </p>
                    <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border ${getPresenceClasses(friend)}`}>
                      {getPresenceLabel(friend)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    @{friend.name} • {friend.id}
                  </p>
                  {friend.isOnline && friend.lastLocation ? (
                    <p className="text-xs text-muted-foreground truncate">
                      {friend.lastLocation}
                    </p>
                  ) : null}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                disabled={unfriendLoading}
                onClick={() => confirmUnfriend([friend])}
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirm.open}
        title={confirm.friends.length > 1 ? 'Hapus pertemanan terpilih?' : 'Hapus pertemanan?'}
        message={
          confirm.friends.length > 1
            ? `Yakin ingin menghapus ${confirm.friends.length} pertemanan sekaligus?`
            : confirm.friends[0]
              ? `Yakin ingin menghapus pertemanan dengan "${confirm.friends[0].displayName || confirm.friends[0].name}"?`
              : 'Yakin?'
        }
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={doUnfriend}
        onCancel={() => setConfirm({ open: false, friends: [] })}
        isDestructive
        isLoading={unfriendLoading}
      />
    </div>
  );
}
