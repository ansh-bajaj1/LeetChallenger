import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { createApi } from './api';

const STORAGE_KEY = 'leetcode_tracer_auth';

const defaultAuthState = {
  token: '',
  user: null,
};

const getRequestErrorMessage = (err, fallback) => {
  if (!err?.response) {
    return 'Cannot reach backend. Start backend server and MongoDB, then try again.';
  }

  return err.response?.data?.message || fallback;
};

function StatCard({ title, value }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{title}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function CompareCharts({ compare }) {
  if (!compare) {
    return null;
  }

  const progressSeries = [
    {
      stage: 'Easy',
      me: compare.me.stats.easySolved,
      friend: compare.friend.stats.easySolved,
    },
    {
      stage: 'Easy+Medium',
      me: compare.me.stats.easySolved + compare.me.stats.mediumSolved,
      friend: compare.friend.stats.easySolved + compare.friend.stats.mediumSolved,
    },
    {
      stage: 'Total',
      me: compare.me.stats.totalSolved,
      friend: compare.friend.stats.totalSolved,
    },
  ];

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[var(--border)] p-4">
        <p className="mb-3 text-sm font-medium">Solved by difficulty</p>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={compare.chartSeries}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(127,127,127,0.2)" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="me" name="You" fill="#d9653b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="friend" name="Friend" fill="#2f6fb3" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--border)] p-4">
        <p className="mb-3 text-sm font-medium">Progress curve</p>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart data={progressSeries}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(127,127,127,0.2)" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="me" name="You" stroke="#d9653b" strokeWidth={3} dot={{ r: 4 }} />
              <Line dataKey="friend" name="Friend" stroke="#2f6fb3" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultAuthState;
  });
  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [requestUsername, setRequestUsername] = useState('');
  const [directUsername, setDirectUsername] = useState('');
  const [requests, setRequests] = useState([]);
  const [mates, setMates] = useState([]);
  const [tracked, setTracked] = useState([]);
  const [compare, setCompare] = useState(null);
  const [challengeInbox, setChallengeInbox] = useState([]);
  const [challengeSent, setChallengeSent] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [challengeForm, setChallengeForm] = useState({
    username: '',
    questionNumbers: '',
    note: '',
  });
  const [profileLeetCodeUsername, setProfileLeetCodeUsername] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const api = useMemo(() => createApi(auth.token), [auth.token]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const loadDashboard = async () => {
    try {
      const [reqRes, mateRes, directRes, inboxRes, sentRes] = await Promise.all([
        api.get('/tracker/requests'),
        api.get('/tracker/connections'),
        api.get('/tracker/direct'),
        api.get('/tracker/challenges/inbox'),
        api.get('/tracker/challenges/sent'),
      ]);

      setRequests(reqRes.data.requests || []);
      setMates(mateRes.data.mates || []);
      setTracked(directRes.data.tracked || []);
      setChallengeInbox(inboxRes.data.challenges || []);
      setChallengeSent(sentRes.data.challenges || []);
      setUnreadCount(inboxRes.data.unreadCount || 0);
    } catch {
      setError('Unable to load dashboard data.');
    }
  };

  useEffect(() => {
    if (!auth.token) {
      return;
    }

    loadDashboard();
  }, [api, auth.token]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', registerForm);
      setAuth({ token: res.data.token, user: res.data.user });
    } catch (err) {
      setError(getRequestErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', loginForm);
      setAuth({ token: res.data.token, user: res.data.user });
    } catch (err) {
      setError(getRequestErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/tracker/request', { username: requestUsername });
      setRequestUsername('');
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send request');
    }
  };

  const handleRequestAction = async (id, action) => {
    setError('');
    try {
      await api.post(`/tracker/requests/${id}/respond`, { action });
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update request');
    }
  };

  const handleDirectTrack = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/tracker/direct', { username: directUsername });
      setDirectUsername('');
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to track user');
    }
  };

  const handleSendChallenge = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const questionNumbers = challengeForm.questionNumbers
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item > 0);

      await api.post('/tracker/challenges/send', {
        username: challengeForm.username,
        questionNumbers,
        note: challengeForm.note,
      });

      setChallengeForm({ username: '', questionNumbers: '', note: '' });
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send challenge');
    }
  };

  const markChallengeRead = async (challengeId) => {
    setError('');
    try {
      await api.post(`/tracker/challenges/${challengeId}/read`);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to mark challenge as read');
    }
  };

  const handleCompleteProfile = async (event) => {
    event.preventDefault();
    setError('');
    setProfileSaving(true);

    try {
      const response = await api.post('/auth/profile/leetcode', {
        leetcodeUsername: profileLeetCodeUsername,
      });

      setAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          leetcodeUsername: response.data.user.leetcodeUsername,
        },
      }));
      setProfileLeetCodeUsername('');
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCompare = async (username) => {
    setError('');
    try {
      const res = await api.get(`/tracker/compare/${username}`);
      setCompare(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to compare now');
    }
  };

  const logout = () => {
    setAuth(defaultAuthState);
    setCompare(null);
    setRequests([]);
    setMates([]);
    setTracked([]);
    setChallengeInbox([]);
    setChallengeSent([]);
    setUnreadCount(0);
  };

  if (!auth.token) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-8">
        <section className="glass-card grid w-full overflow-hidden rounded-3xl md:grid-cols-2">
          <div className="bg-[var(--accent-soft)]/65 p-8 sm:p-12">
            <p className="font-display text-sm uppercase tracking-[0.28em] text-[var(--muted)]">LeetCode Tracer</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Challenge your coding friends, daily.
            </h1>
            <p className="mt-6 max-w-md text-[var(--muted)]">
              Send accept requests for mutual comparison, or directly track any LeetCode username in one place.
            </p>
            <button
              type="button"
              className="mt-8 rounded-full border border-[var(--border)] bg-black/85 px-5 py-2 text-sm font-medium text-white"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              Theme: {theme}
            </button>
          </div>
          <div className="p-8 sm:p-12">
            <div className="mb-6 inline-flex rounded-full bg-black/5 p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2 ${mode === 'login' ? 'bg-black text-white' : 'text-[var(--muted)]'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-full px-4 py-2 ${mode === 'register' ? 'bg-black text-white' : 'text-[var(--muted)]'}`}
              >
                Register
              </button>
            </div>

            {mode === 'login' ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
                  placeholder="Email or username"
                  value={loginForm.emailOrUsername}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, emailOrUsername: e.target.value }))}
                />
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : 'Login'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
                  placeholder="Full name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
                  placeholder="App username"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                />
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                <input
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                />
                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : 'Create account'}
                </button>
              </form>
            )}

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <header className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
        <div>
          <p className="font-display text-xl">Welcome, {auth.user?.name}</p>
          <p className="text-sm text-[var(--muted)]">@{auth.user?.username}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            LeetCode: {auth.user?.leetcodeUsername ? `@${auth.user.leetcodeUsername}` : 'Not linked yet'}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Challenge inbox unread: {unreadCount}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Dark' : 'Light'} theme
          </button>
          <button
            type="button"
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {!auth.user?.leetcodeUsername && (
        <section className="glass-card mb-6 rounded-2xl border-2 border-[var(--accent)]/40 p-5">
          <h2 className="font-display text-2xl">Complete profile to unlock compare</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Add your LeetCode username once. We verify it before enabling compare charts.
          </p>
          <form onSubmit={handleCompleteProfile} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
              placeholder="Your LeetCode username"
              value={profileLeetCodeUsername}
              onChange={(e) => setProfileLeetCodeUsername(e.target.value)}
            />
            <button
              disabled={profileSaving}
              className="rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {profileSaving ? 'Saving...' : 'Save username'}
            </button>
          </form>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-2xl">Compete with a friend</h2>
          <p className="mb-4 mt-1 text-sm text-[var(--muted)]">Send request by app username (they must accept).</p>
          <form onSubmit={handleSendRequest} className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
              placeholder="Friend app username"
              value={requestUsername}
              onChange={(e) => setRequestUsername(e.target.value)}
            />
            <button className="rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-white">Send</button>
          </form>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-2xl">Direct tracking</h2>
          <p className="mb-4 mt-1 text-sm text-[var(--muted)]">Track any LeetCode username without acceptance.</p>
          <form onSubmit={handleDirectTrack} className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
              placeholder="LeetCode username"
              value={directUsername}
              onChange={(e) => setDirectUsername(e.target.value)}
            />
            <button className="rounded-xl bg-black px-5 py-3 font-medium text-white">Track</button>
          </form>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display text-xl">Pending requests</h3>
          <div className="mt-3 space-y-3">
            {requests.length === 0 && <p className="text-sm text-[var(--muted)]">No pending requests.</p>}
            {requests.map((req) => (
              <div key={req._id} className="rounded-xl border border-[var(--border)] p-3">
                <p className="font-medium">{req.requester.name}</p>
                <p className="text-sm text-[var(--muted)]">@{req.requester.username}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRequestAction(req._id, 'accept')}
                    className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs text-white"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestAction(req._id, 'reject')}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display text-xl">Accepted mates</h3>
          <div className="mt-3 space-y-3">
            {mates.length === 0 && <p className="text-sm text-[var(--muted)]">No mates connected yet.</p>}
            {mates.map((mate) => (
              <div key={mate.connectionId} className="rounded-xl border border-[var(--border)] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{mate.name}</p>
                    <p className="text-sm text-[var(--muted)]">@{mate.username}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {mate.leetcodeUsername ? `LeetCode: @${mate.leetcodeUsername}` : 'LeetCode not linked'}
                    </p>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => handleCompare(mate.username)}
                      disabled={!auth.user?.leetcodeUsername || !mate.canCompare}
                      className="rounded-lg bg-black px-3 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Compare
                    </button>
                    <p className="mt-1 text-xs text-[var(--muted)]">Unread challenges: {mate.unreadChallenges || 0}</p>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setChallengeForm((prev) => ({
                        ...prev,
                        username: mate.username,
                      }))
                    }
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs"
                  >
                    Use in challenge form
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display text-xl">Direct tracked users</h3>
          <div className="mt-3 space-y-3">
            {tracked.length === 0 && <p className="text-sm text-[var(--muted)]">No direct users tracked yet.</p>}
            {tracked.map((item) => (
              <div key={item.id} className="rounded-xl border border-[var(--border)] p-3">
                <p className="font-medium">@{item.username}</p>
                {item.error ? (
                  <p className="text-sm text-red-500">{item.error}</p>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <StatCard title="Total" value={item.stats.totalSolved} />
                    <StatCard title="Acceptance" value={`${item.stats.acceptanceRate}%`} />
                    <StatCard title="Easy" value={item.stats.easySolved} />
                    <StatCard title="Medium" value={item.stats.mediumSolved} />
                    <StatCard title="Hard" value={item.stats.hardSolved} />
                    <StatCard title="Ranking" value={item.stats.ranking} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 lg:col-span-1">
          <h3 className="font-display text-xl">Send challenge</h3>
          <p className="mb-4 mt-1 text-sm text-[var(--muted)]">Send LeetCode question numbers to your connected mate.</p>
          <form className="space-y-3" onSubmit={handleSendChallenge}>
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
              placeholder="Friend username"
              value={challengeForm.username}
              onChange={(e) => setChallengeForm((prev) => ({ ...prev, username: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
              placeholder="Question numbers (e.g. 1,2,15,704)"
              value={challengeForm.questionNumbers}
              onChange={(e) => setChallengeForm((prev) => ({ ...prev, questionNumbers: e.target.value }))}
            />
            <textarea
              className="min-h-24 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none"
              placeholder="Optional note"
              value={challengeForm.note}
              onChange={(e) => setChallengeForm((prev) => ({ ...prev, note: e.target.value }))}
            />
            <button className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-white">Send challenge</button>
          </form>
        </div>
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-display text-xl">Challenge notifications</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Inbox</p>
              <div className="space-y-2">
                {challengeInbox.length === 0 && <p className="text-sm text-[var(--muted)]">No incoming challenges.</p>}
                {challengeInbox.map((item) => (
                  <div key={item._id} className="rounded-xl border border-[var(--border)] p-3 text-sm">
                    <p>
                      From: <span className="font-medium">@{item.sender?.username}</span>
                    </p>
                    <p className="mt-1 text-[var(--muted)]">Questions: {item.questionNumbers.join(', ')}</p>
                    {item.note && <p className="mt-1 text-[var(--muted)]">Note: {item.note}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${item.isRead ? 'bg-green-600/20' : 'bg-orange-600/20'}`}>
                        {item.isRead ? 'Read' : 'Unread'}
                      </span>
                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={() => markChallengeRead(item._id)}
                          className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Sent</p>
              <div className="space-y-2">
                {challengeSent.length === 0 && <p className="text-sm text-[var(--muted)]">No sent challenges yet.</p>}
                {challengeSent.map((item) => (
                  <div key={item._id} className="rounded-xl border border-[var(--border)] p-3 text-sm">
                    <p>
                      To: <span className="font-medium">@{item.recipient?.username}</span>
                    </p>
                    <p className="mt-1 text-[var(--muted)]">Questions: {item.questionNumbers.join(', ')}</p>
                    {item.note && <p className="mt-1 text-[var(--muted)]">Note: {item.note}</p>}
                    <p className="mt-2 text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {compare && (
        <section className="glass-card mt-6 rounded-2xl p-5">
          <h3 className="font-display text-2xl">Comparison: @{compare.me.username} vs @{compare.friend.username}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-[var(--border)] p-4">
              <h4 className="font-medium">You</h4>
              <div className="grid grid-cols-2 gap-3">
                <StatCard title="Total" value={compare.me.stats.totalSolved} />
                <StatCard title="Easy" value={compare.me.stats.easySolved} />
                <StatCard title="Medium" value={compare.me.stats.mediumSolved} />
                <StatCard title="Hard" value={compare.me.stats.hardSolved} />
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-[var(--border)] p-4">
              <h4 className="font-medium">Friend</h4>
              <div className="grid grid-cols-2 gap-3">
                <StatCard title="Total" value={compare.friend.stats.totalSolved} />
                <StatCard title="Easy" value={compare.friend.stats.easySolved} />
                <StatCard title="Medium" value={compare.friend.stats.mediumSolved} />
                <StatCard title="Hard" value={compare.friend.stats.hardSolved} />
              </div>
            </div>
          </div>
          <CompareCharts compare={compare} />
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <StatCard title="Your acceptance" value={`${compare.meta.meAcceptanceRate}%`} />
            <StatCard title="Friend acceptance" value={`${compare.meta.friendAcceptanceRate}%`} />
            <StatCard title="Your ranking" value={compare.meta.meRanking} />
            <StatCard title="Friend ranking" value={compare.meta.friendRanking} />
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Delta solved (you - friend): <span className="font-semibold text-[var(--text)]">{compare.deltaSolved}</span>
          </p>
        </section>
      )}
    </main>
  );
}

export default App;
