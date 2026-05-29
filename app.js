// app.js — Multi-tenant SaaS version
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth, signInAnonymously, onAuthStateChanged,
    signInWithPopup, GoogleAuthProvider,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    getFirestore, collection, addDoc, updateDoc, doc,
    deleteDoc, setDoc, getDoc, onSnapshot, query,
    where, getDocs, serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ── Firebase Init (inline) ─────────────────────
const _firebaseConfig = {
    apiKey: "AIzaSyBz5Cm-qsKe9pshGLaBkzw0WTOg9OLDwHk",
    authDomain: "invoice-99bdb.firebaseapp.com",
    projectId: "invoice-99bdb",
    storageBucket: "invoice-99bdb.firebasestorage.app",
    messagingSenderId: "1055209115726",
    appId: "1:1055209115726:web:926791697e6ad783e5b31f"
};
const _app = initializeApp(_firebaseConfig);
const auth = getAuth(_app);
const db   = getFirestore(_app);


// ─────────────────────────────────────────────
// ROLE PERMISSIONS
// ─────────────────────────────────────────────
const ROLE_PERMISSIONS = {
    owner: [
        "view_dashboard","create_invoice","edit_invoice","delete_invoice",
        "create_quotation","edit_quotation","delete_quotation",
        "create_contract","edit_contract","delete_contract",
        "manage_customers","manage_expenses","manage_salary",
        "view_reports","manage_settings","manage_members",
        "delete_company"
    ],
    admin: [
        "view_dashboard","create_invoice","edit_invoice","delete_invoice",
        "create_quotation","edit_quotation","delete_quotation",
        "create_contract","edit_contract","delete_contract",
        "manage_customers","manage_expenses","manage_salary",
        "view_reports","manage_settings"
    ],
    staff: [
        "view_dashboard","create_invoice","create_quotation",
        "manage_customers","view_reports"
    ]
};

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const resources = {
    en: {
        verify_payment_title:"Verify Payment", method_1:"Method 1 - Enter Number",
        method_2:"Method 2 - Scan QR Code", use_camera:"Use Camera to Scan",
        admin_login_link:"Admin Click Here", check_btn:"Check", scan_qr:"Scan QR Code",
        admin_login:"Admin Login", login_btn:"Login", home:"Home",
        dashboard:"Dashboard", logout:"Logout", invoices:"Invoices",
        quotations:"Quotations", contracts:"Contracts", customers:"Customers",
        expenses:"Expenses", reports:"Reports", settings:"Settings",
        year:"Year", month:"Month", customer:"Customer", filter_btn:"Filter",
        create_new:"Create New", client_name:"Client Name", items:"Items",
        add_item:"Add Item", subtotal:"Subtotal:", discount:"Discount (Ks):",
        total:"Total:", deposit:"Payment / Deposit:", balance:"Balance:",
        cancel:"Cancel", save:"Save", add_customer:"Add Customer",
        add_expense:"Add Expense", logo:"Company Logo", change_logo:"Change Logo",
        auth_name:"Auth Person Name", auth_sign:"Auth Signature", upload:"Upload",
        payment_accounts:"Payment Footer Info", terms:"Terms / Note",
        save_settings:"Save Settings", back:"Back", print:"Print",
        add_payment:"Add Payment", paid:"Paid:", confirm:"Confirm",
        create_invoice:"Create Invoice", manual_invoice:"Manual Invoice",
        from_quotation:"From Quotation", load:"Load", edit_contract:"Contract Editor",
        financial_overview:"Financial Overview", income:"Income",
        expense_label:"Expenses", net_profit:"Net Profit", receivable:"Receivable",
        refund_total:"Total Refunded", bill_to:"Bill To:", date:"Date:",
        payment_history:"Payment History", payment_info:"Payment Info:",
        terms_conditions:"Terms & Conditions:",
        system_generated:"This invoice is system generated and is valid without a seal.",
        authorized_signature:"Authorized Signature", desc:"Description",
        qty:"Qty", price:"Price", no:"No.",
        refund_confirm:"Mark this invoice as REFUNDED? This cannot be undone.",
        status:"Status", members:"Members", company:"Company",
        register:"Register", create_company:"Create Company",
        join_company:"Join Company", invite_code:"Invite Code",
        company_name:"Company Name", your_name:"Your Name",
        select_company:"Select Company", switch_company:"Switch Company"
    },
    my: {
        verify_payment_title:"ငွေပေးချေမှု စစ်ဆေးရန်",
        method_1:"နည်းလမ်း (၁) - နံပါတ်ရိုက်ထည့်ရန်",
        method_2:"နည်းလမ်း (၂) - QR Code ဖတ်ရန်",
        use_camera:"ကင်မရာအသုံးပြု၍ စစ်ဆေးပါ",
        admin_login_link:"Admin ဝင်ရန် နှိပ်ပါ", check_btn:"စစ်ဆေးမည်",
        scan_qr:"QR Code ဖတ်ရန်", admin_login:"Admin ဝင်ရောက်ရန်",
        login_btn:"ဝင်ရောက်မည်", home:"မူလစာမျက်နှာ",
        dashboard:"ဒက်ရှ်ဘုတ်", logout:"ထွက်မည်",
        invoices:"အင်ဗွိုက်များ", quotations:"ကိုတေးရှင်းများ",
        contracts:"စာချုပ်များ", customers:"ဖောက်သည်များ",
        expenses:"ကုန်ကျစရိတ်များ", reports:"စာရင်းချုပ်",
        settings:"ဆက်တင်များ", year:"ခုနှစ်", month:"လ",
        customer:"ဖောက်သည်", filter_btn:"ကြည့်မည်",
        create_new:"အသစ်ဖန်တီးမည်", client_name:"ဖောက်သည် အမည်",
        items:"ပစ္စည်းစာရင်း", add_item:"ပစ္စည်းထပ်ထည့်မည်",
        subtotal:"စုစုပေါင်း (လျော့စျေးမပါ):", discount:"လျော့စျေး (ကျပ်):",
        total:"စုစုပေါင်း:", deposit:"စရန် / ပေးချေငွေ:", balance:"ကျန်ငွေ:",
        cancel:"မလုပ်တော့ပါ", save:"သိမ်းမည်",
        add_customer:"ဖောက်သည်အသစ်ထည့်ရန်", add_expense:"စရိတ်စာရင်းသွင်းရန်",
        logo:"လုပ်ငန်းလိုဂို", change_logo:"လိုဂိုပြောင်းမည်",
        auth_name:"တာဝန်ခံ အမည်", auth_sign:"လက်မှတ်", upload:"တင်မည်",
        payment_accounts:"ငွေလွှဲရန် အချက်အလက်များ (အောက်ခြေ)",
        terms:"စည်းကမ်းချက် / မှတ်ချက်", save_settings:"ဆက်တင်သိမ်းမည်",
        back:"နောက်သို့", print:"ပရင့်ထုတ်မည်", add_payment:"ငွေလက်ခံမည်",
        paid:"ပေးချေပြီး:", confirm:"အတည်ပြုမည်",
        create_invoice:"Invoice ဖွင့်မည်", manual_invoice:"Manual Invoice ဖွင့်မည်",
        from_quotation:"Quotation မှ ပြောင်းမည်", load:"ရှာဖွေမည်",
        edit_contract:"စာချုပ်ရေးသားရန်", financial_overview:"ဘဏ္ဍာရေး သုံးသပ်ချက်",
        income:"ဝင်ငွေ", expense_label:"ထွက်ငွေ (စရိတ်)",
        net_profit:"အသားတင်အမြတ်", receivable:"ရရန်ရှိ (ကြွေးကျန်)",
        refund_total:"ပြန်အမ်းငွေ စုစုပေါင်း",
        bill_to:"ဝယ်ယူသူ အမည်:", date:"ရက်စွဲ:",
        payment_history:"ပေးချေမှု မှတ်တမ်း", payment_info:"ငွေပေးချေရန်:",
        terms_conditions:"စည်းကမ်းချက်များ:",
        system_generated:"ဤဘောက်ချာသည် စနစ်မှ အလိုအလျောက် ထုတ်ထားခြင်းဖြစ်၍ တံဆိပ်တုံးမပါဘဲ အတည်ဖြစ်သည်။",
        authorized_signature:"တာဝန်ခံ လက်မှတ်",
        desc:"အမျိုးအမည်", qty:"အရေအတွက်", price:"ဈေးနှုန်း", no:"စဉ်",
        refund_confirm:"ဤ Invoice ကို ငွေပြန်အမ်း (Refund) အဖြစ် သတ်မှတ်မည်လား? ပြန်ပြင်၍ မရပါ။",
        status:"အခြေအနေ", members:"အဖွဲ့ဝင်များ", company:"ကုမ္ပဏီ",
        register:"စာရင်းသွင်းရန်", create_company:"ကုမ္ပဏီဖန်တီးရန်",
        join_company:"ကုမ္ပဏီ ဝင်ရောက်ရန်", invite_code:"ဖိတ်ကြားကုဒ်",
        company_name:"ကုမ္ပဏီအမည်", your_name:"သင့်အမည်",
        select_company:"ကုမ္ပဏီရွေးချယ်ရန်", switch_company:"ကုမ္ပဏီပြောင်းရန်"
    }
};

// ─────────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────────
const state = {
    user: null, isAdmin: false,
    view: 'home', activeTab: 'invoice', mode: 'invoice',

    // Multi-tenant
    companyId: null, companyData: null, userRole: null, userCompanies: [],

    // Collections (scoped to company)
    invoices: [], quotations: [], customers: [], expenses: [],
    contracts: [], payment_methods: [], adjustments: [], salaryIncomes: [],

    // Listeners (to unsubscribe when switching company)
    listeners: [],

    // Form state
    currentDoc: null,
    items: [{ desc: '', price: 0, qty: 1, image: null }],
    discount: 0, taxRate: 0, initPayment: 0, serviceFee: 0,
    tempInvoice: null, html5QrCode: null, editingId: null,
    uploadingRowIndex: null, isConverted: false,
    settings: {
        logo: null, accounts: '', terms: '', authName: '', authSign: null,
        bizAddress: '', bizPhone: '', bizWeb: '', bizEmail: '', bizName: '',
        taxRate: 0, expense_categories: []
    },
    lang: localStorage.getItem('appLang') || 'en',
    defaultMethods: [{ name: 'Cash' }, { name: 'KPay' }, { name: 'Wave' }, { name: 'Bank' }],
    filters: { year: 'all', month: 'all', customer: 'all', status: 'all', company: 'all' },
    charts: {}
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const t    = (key) => resources[state.lang][key] || key;
const can  = (perm) => ROLE_PERMISSIONS[state.userRole]?.includes(perm) ?? false;
const cCol = (coll) => collection(db, 'companies', state.companyId, coll);
const cDoc = (coll, id) => doc(db, 'companies', state.companyId, coll, id);

function genId(prefix) {
    return prefix + '-' + Date.now().toString().slice(-6);
}

function unsubAll() {
    state.listeners.forEach(u => { try { u(); } catch (_) {} });
    state.listeners = [];
}

// ─────────────────────────────────────────────
// APP OBJECT
// ─────────────────────────────────────────────
const app = {

    // ── INIT ──────────────────────────────────
    init() {
        app.updateLangButton();
        onAuthStateChanged(auth, async (u) => {
            if (u && !u.isAnonymous) {
                state.user    = u;
                state.isAdmin = true;
                await app.loadUserCompanies();
            } else {
                state.user    = u;
                state.isAdmin = false;
                state.companyId = null;
                unsubAll();
            }
            const params = new URLSearchParams(window.location.search);
            if (params.get('code') || params.get('id')) {
                app.handleSearch(params.get('code') || params.get('id'));
            } else {
                app.setView(state.isAdmin && state.companyId ? 'dashboard' : 'home');
            }
        });
        window.addEventListener('resize', app.scalePaper);
    },

    // ── LANG ──────────────────────────────────
    toggleLang() {
        state.lang = state.lang === 'en' ? 'my' : 'en';
        localStorage.setItem('appLang', state.lang);
        app.updateLangButton();
        app.setView(state.view);
    },
    updateLangButton() {
        const icon = document.getElementById('lang-icon');
        const text = document.getElementById('lang-text');
        if (icon && text) {
            icon.innerText = state.lang === 'en' ? '🇬🇧' : '🇲🇲';
            text.innerText = state.lang === 'en' ? 'EN' : 'MY';
        }
    },
    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            el.innerText = t(el.getAttribute('data-translate'));
        });
    },

    // ── COMPANY LOADING ────────────────────────
    async loadUserCompanies() {
        // Firestore doesn't support 'in' on map fields — use != null instead
        let snap;
        try {
            snap = await getDocs(
                query(collection(db, 'companies'),
                      where(`members.${state.user.uid}`, '!=', null))
            );
        } catch(e) {
            // Fallback: get all companies and filter client-side
            snap = await getDocs(collection(db, 'companies'));
        }
        state.userCompanies = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(c => c.members && c.members[state.user.uid]);

        const saved = localStorage.getItem('activeCompany');
        const match = state.userCompanies.find(c => c.id === saved);

        if (state.userCompanies.length === 0) {
            app.setView('onboarding');
        } else if (match) {
            app.selectCompany(match.id);
        } else if (state.userCompanies.length === 1) {
            app.selectCompany(state.userCompanies[0].id);
        } else {
            app.setView('company-select');
        }
    },

    selectCompany(companyId) {
        state.companyId  = companyId;
        state.companyData = state.userCompanies.find(c => c.id === companyId);
        state.userRole   = state.companyData?.members?.[state.user.uid] || 'staff';
        localStorage.setItem('activeCompany', companyId);
        unsubAll();
        app.listenCompanyData();
        app.listenSettings();
        app.setView('dashboard');
    },

    // ── REALTIME LISTENERS ─────────────────────
    listenCompanyData() {
        const colls = [
            'invoices','quotations','customers','expenses',
            'adjustments','contracts','salary_incomes','payment_methods'
        ];
        colls.forEach(coll => {
            const unsub = onSnapshot(cCol(coll), (snapshot) => {
                const items = snapshot.docs.map(d => ({
                    id: d.id, ...d.data(),
                    type: coll.replace('_incomes','').replace(/s$/,'')
                }));
                const key = coll === 'salary_incomes' ? 'salaryIncomes' : coll;
                state[key] = items;
                if (coll !== 'payment_methods') {
                    state[key].sort((a, b) => {
                        const tA = a.createdAt?.seconds || new Date(a.date || 0).getTime() / 1000;
                        const tB = b.createdAt?.seconds || new Date(b.date || 0).getTime() / 1000;
                        return tB - tA;
                    });
                }
                if (state.view === 'dashboard' && state.activeTab === coll.replace('_incomes','salary').replace(/s$/,''))
                    app.applyFilters();
                if (state.view === 'dashboard' && state.activeTab === 'report')
                    app.renderReports();
                if (coll === 'payment_methods' && state.view === 'settings')
                    app.renderPaymentMethods();
            });
            state.listeners.push(unsub);
        });
    },

    listenSettings() {
        const unsub = onSnapshot(cDoc('_config', 'general'), (snap) => {
            if (snap.exists()) {
                state.settings = snap.data();
                if (!state.settings.expense_categories?.length) {
                    state.settings.expense_categories = ['Food','Transportation','Salary','Rent','Marketing','Utility','Other'];
                }
            }
        });
        state.listeners.push(unsub);
    },

    // ── VIEWS ─────────────────────────────────
    setView(viewName) {
        state.view = viewName;
        const main = document.getElementById('main-container');
        const tpl  = document.getElementById(`tpl-${viewName}`);
        if (!tpl) { console.warn('No template for', viewName); return; }

        const needsCompany = ['dashboard','settings','contract-edit','create','members'];
        if (needsCompany.includes(viewName) && !state.isAdmin) return app.setView('login');
        if (needsCompany.includes(viewName) && !state.companyId) return app.setView('company-select');

        main.innerHTML = '';
        main.appendChild(tpl.content.cloneNode(true));
        app.translatePage();
        app.updateLangButton();
        if (window.lucide) lucide.createIcons();

        if (viewName === 'dashboard')     app.switchTab(state.activeTab);
        if (viewName === 'settings')      app.initSettingsView();
        if (viewName === 'create')        app.initCreateForm();
        if (viewName === 'contract-edit') app.initContractEditor();
        if (viewName === 'verify')        setTimeout(app.scalePaper, 100);
        if (viewName === 'members')       app.renderMembersPage();
        if (viewName === 'company-select') app.renderCompanySelect();
        if (viewName === 'onboarding')    app.renderOnboarding();
    },

    // ── COMPANY SELECT / ONBOARDING ────────────
    renderCompanySelect() {
        const list = document.getElementById('company-list-select');
        if (!list) return;
        list.innerHTML = state.userCompanies.map(c => `
            <button onclick="app.selectCompany('${c.id}')"
                class="w-full text-left p-4 bg-white border rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm">
                <div class="font-bold text-gray-800">${c.name}</div>
                <div class="text-xs text-gray-400 mt-1">
                    Role: <span class="capitalize font-medium text-blue-600">${c.members?.[state.user?.uid] || 'member'}</span>
                </div>
            </button>
        `).join('');
    },

    renderOnboarding() {
        // Rendered by template, nothing dynamic needed on init
    },

    // Create company (owner)
    async createCompany(e) {
        e.preventDefault();
        const name     = document.getElementById('ob-company-name').value.trim();
        const userName = document.getElementById('ob-user-name').value.trim();
        if (!name || !userName) return;

        if (userName && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: userName });
        }

        const inviteCode = 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const compRef = await addDoc(collection(db, 'companies'), {
            name,
            ownerId:    state.user.uid,
            inviteCode,
            plan:       'free',
            createdAt:  serverTimestamp(),
            members:    { [state.user.uid]: 'owner' }
        });

        // Default settings
        await setDoc(doc(db, 'companies', compRef.id, '_config', 'general'), {
            bizName: name, accounts: '', terms: '', authName: '',
            taxRate: 0, expense_categories: ['Food','Transportation','Salary','Rent','Marketing','Utility','Other']
        });

        state.userCompanies.push({ id: compRef.id, name, members: { [state.user.uid]: 'owner' } });
        app.selectCompany(compRef.id);
    },

    // Join company via invite code
    async joinCompany(e) {
        e.preventDefault();
        const code = document.getElementById('ob-invite-code').value.trim().toUpperCase();
        if (!code) return;

        const snap = await getDocs(
            query(collection(db, 'companies'), where('inviteCode', '==', code))
        );
        if (snap.empty) { alert('Invalid invite code'); return; }

        const compDoc = snap.docs[0];
        const existing = compDoc.data().members?.[state.user.uid];
        if (existing) {
            // Already member, just select
            if (!state.userCompanies.find(c => c.id === compDoc.id)) {
                state.userCompanies.push({ id: compDoc.id, ...compDoc.data() });
            }
            app.selectCompany(compDoc.id);
            return;
        }

        await updateDoc(doc(db, 'companies', compDoc.id), {
            [`members.${state.user.uid}`]: 'staff'
        });
        state.userCompanies.push({ id: compDoc.id, ...compDoc.data(), members: { ...compDoc.data().members, [state.user.uid]: 'staff' } });
        app.selectCompany(compDoc.id);
    },

    // ── MEMBERS PAGE ───────────────────────────
    async renderMembersPage() {
        if (!can('manage_members')) {
            document.getElementById('members-content').innerHTML =
                '<div class="p-8 text-center text-red-400">No permission</div>';
            return;
        }
        const compRef = doc(db, 'companies', state.companyId);
        const snap    = await getDoc(compRef);
        const comp    = snap.data();
        const members = comp.members || {};

        const rows = await Promise.all(Object.entries(members).map(async ([uid, role]) => {
            // Try to get display name from users subcollection if exists
            let name = uid.slice(0, 8) + '...';
            try {
                const uSnap = await getDoc(doc(db, 'users', uid));
                if (uSnap.exists()) name = uSnap.data().displayName || name;
            } catch (_) {}
            return { uid, role, name };
        }));

        const list = document.getElementById('members-content');
        list.innerHTML = `
            <div class="p-4 space-y-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-lg">Team Members</h3>
                        <p class="text-xs text-gray-500">Invite Code: <span class="font-mono font-bold text-blue-600">${comp.inviteCode}</span></p>
                    </div>
                    ${can('manage_members') ? `
                    <button onclick="app.showChangeRoleHelp()" class="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                        Invite via Code
                    </button>` : ''}
                </div>
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b">
                        <tr><th class="p-3 text-left">Member</th><th class="p-3 text-left">Role</th><th class="p-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody class="divide-y">
                        ${rows.map(r => `
                        <tr class="hover:bg-gray-50">
                            <td class="p-3">
                                <div class="font-medium">${r.name}</div>
                                <div class="text-xs text-gray-400">${r.uid}</div>
                            </td>
                            <td class="p-3">
                                <span class="px-2 py-1 rounded text-xs font-bold capitalize
                                    ${r.role==='owner'?'bg-purple-100 text-purple-700':
                                      r.role==='admin'?'bg-blue-100 text-blue-700':
                                      'bg-gray-100 text-gray-600'}">
                                    ${r.role}
                                </span>
                            </td>
                            <td class="p-3 text-right">
                                ${r.uid !== state.user.uid && r.role !== 'owner' && can('manage_members') ? `
                                <select onchange="app.changeRole('${r.uid}', this.value)"
                                    class="border text-xs p-1 rounded mr-2">
                                    <option value="admin" ${r.role==='admin'?'selected':''}>Admin</option>
                                    <option value="staff" ${r.role==='staff'?'selected':''}>Staff</option>
                                </select>
                                <button onclick="app.removeMember('${r.uid}')"
                                    class="text-red-500 text-xs hover:text-red-700">Remove</button>
                                ` : '<span class="text-xs text-gray-400">—</span>'}
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    showChangeRoleHelp() {
        alert(`Share this invite code with your team:\n\n${state.companyData?.inviteCode}\n\nThey can join via Register > Join Company.`);
    },

    async changeRole(uid, role) {
        await updateDoc(doc(db, 'companies', state.companyId), {
            [`members.${uid}`]: role
        });
        app.renderMembersPage();
    },

    async removeMember(uid) {
        if (!confirm('Remove this member?')) return;
        const compRef  = doc(db, 'companies', state.companyId);
        const snap     = await getDoc(compRef);
        const members  = snap.data().members || {};
        delete members[uid];
        await updateDoc(compRef, { members });
        app.renderMembersPage();
    },

    // ── AUTH ──────────────────────────────────
    async handleEmailAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass  = document.getElementById('password').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (err) {
            const el = document.getElementById('auth-error');
            if (el) { el.innerText = err.message; el.classList.remove('hidden'); }
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const email    = document.getElementById('reg-email').value;
        const pass     = document.getElementById('reg-password').value;
        const name     = document.getElementById('reg-name').value;
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(cred.user, { displayName: name });
            // Save to users collection for display names
            await setDoc(doc(db, 'users', cred.user.uid), {
                displayName: name, email, createdAt: serverTimestamp()
            });
        } catch (err) {
            const el = document.getElementById('reg-error');
            if (el) { el.innerText = err.message; el.classList.remove('hidden'); }
        }
    },

    async googleLogin() {
        try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { alert(e.message); }
    },

    async logout() {
        unsubAll();
        state.companyId = null; state.isAdmin = false;
        localStorage.removeItem('activeCompany');
        await signOut(auth);
        try { await signInAnonymously(auth); } catch (_) {}
        app.setView('home');
    },

    handleAuthClick() {
        state.isAdmin ? app.setView('dashboard') : app.setView('login');
    },

    // ── DASHBOARD / TABS ──────────────────────
    switchTab(tab) {
        state.activeTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.className = `tab-btn whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                b.id === 'tab-' + tab
                    ? 'bg-white border shadow-sm text-gray-800'
                    : 'text-gray-500 hover:bg-gray-50'}`;
        });

        const actionBar     = document.getElementById('action-bar');
        const genericFilters = document.getElementById('generic-filters');

        if (tab === 'customer' || tab === 'settings') {
            if (genericFilters) genericFilters.style.display = 'none';
        } else {
            if (genericFilters) { genericFilters.style.display = 'flex'; app.initGenericFilters(); }
        }
        if (document.getElementById('filter-customer-wrapper'))
            document.getElementById('filter-customer-wrapper').style.display = tab === 'expense' ? 'none' : 'block';
        if (document.getElementById('filter-status-wrapper'))
            document.getElementById('filter-status-wrapper').classList.toggle('hidden', tab !== 'invoice');

        if (tab === 'report') {
            if (actionBar) actionBar.style.display = 'none';
            app.renderReports();
        } else {
            if (actionBar) actionBar.style.display = can('create_invoice') ? 'flex' : 'none';
            if (document.getElementById('create-btn-text'))
                document.getElementById('create-btn-text').innerText = t('create_new');
            app.applyFilters();
        }
    },

    initGenericFilters() {
        const yearSel = document.getElementById('filter-year');
        const custSel = document.getElementById('filter-customer');
        if (!yearSel) return;
        if (yearSel.options.length === 0) {
            const y = new Date().getFullYear();
            yearSel.innerHTML = '<option value="all">All Years</option>';
            for (let i = y - 2; i <= y + 1; i++)
                yearSel.innerHTML += `<option value="${i}" ${i===y?'selected':''}>${i}</option>`;
        }
        custSel.innerHTML = '<option value="all">All Customers</option>' +
            state.customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        yearSel.value = state.filters.year;
        document.getElementById('filter-month').value  = state.filters.month;
        custSel.value = state.filters.customer;
        const st = document.getElementById('filter-status');
        if (st) st.value = state.filters.status;
    },

    applyFilters() {
        const yearEl   = document.getElementById('filter-year');
        const monthEl  = document.getElementById('filter-month');
        const custEl   = document.getElementById('filter-customer');
        const statEl   = document.getElementById('filter-status');
        if (!yearEl) return;

        state.filters.year     = yearEl.value;
        state.filters.month    = monthEl.value;
        state.filters.customer = custEl.value;
        state.filters.status   = statEl ? statEl.value : 'all';

        if (state.activeTab === 'report') { app.renderReports(); return; }

        const src = state.activeTab === 'salary'
            ? state.salaryIncomes
            : (state[state.activeTab + 's'] || []);

        const filtered = src.filter(item => {
            const d = item.createdAt?.seconds
                ? new Date(item.createdAt.seconds * 1000)
                : new Date(item.date || 0);
            if (state.filters.year  !== 'all' && d.getFullYear() != state.filters.year)  return false;
            if (state.filters.month !== 'all' && d.getMonth()    != state.filters.month) return false;
            if (state.activeTab !== 'expense' && state.activeTab !== 'salary' &&
                state.filters.customer !== 'all' && item.clientName !== state.filters.customer) return false;
            if (state.activeTab === 'invoice' && state.filters.status !== 'all' &&
                item.status !== state.filters.status) return false;
            return true;
        });

        app.renderList(filtered, state.activeTab);
    },

    // ── RENDER LIST ────────────────────────────
    renderList(data, type) {
        const container = document.getElementById('dashboard-content');
        if (!container) return;
        if (!data?.length) {
            container.innerHTML = `<div class="p-8 text-center text-gray-400">No ${type}s found.</div>`;
            return;
        }

        if (type === 'contract') {
            container.innerHTML = `
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b text-gray-600">
                    <tr><th class="p-3">ID</th><th class="p-3">Title</th><th class="p-3">Client</th>
                    <th class="p-3">Date</th><th class="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody class="divide-y">${data.map(c => `
                    <tr class="hover:bg-gray-50">
                        <td class="p-3 font-mono text-blue-600">${c.quotationNumber}</td>
                        <td class="p-3 font-medium">${c.title}</td>
                        <td class="p-3">${c.clientName}</td>
                        <td class="p-3">${new Date(c.createdAt?.seconds * 1000).toLocaleDateString()}</td>
                        <td class="p-3 text-right flex justify-end gap-1">
                            <button onclick="app.showVerify('${c.id}','contract')" class="icon-btn"><i data-lucide="printer" width="14"></i></button>
                            <button onclick="app.duplicateDoc('${c.id}','contract')" class="icon-btn text-green-600"><i data-lucide="copy" width="14"></i></button>
                            ${can('edit_contract') ? `<button onclick="app.requirePin('editContract','${c.id}')" class="icon-btn text-blue-600"><i data-lucide="pencil" width="14"></i></button>` : ''}
                            ${can('delete_contract') ? `<button onclick="app.requirePin('deleteDoc','${c.id}','contracts')" class="icon-btn text-red-600"><i data-lucide="trash-2" width="14"></i></button>` : ''}
                        </td>
                    </tr>`).join('')}</tbody>
            </table>`;

        } else if (type === 'customer') {
            container.innerHTML = `
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b text-gray-600">
                    <tr><th class="p-3">ID</th><th class="p-3">Name</th><th class="p-3">Phone</th>
                    <th class="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody class="divide-y">${data.map(c => `
                    <tr class="hover:bg-gray-50">
                        <td class="p-3 font-mono text-gray-500">${c.customerId || '-'}</td>
                        <td class="p-3 font-medium">${c.name}</td>
                        <td class="p-3">${c.phone || '-'}</td>
                        <td class="p-3 text-right">
                            ${can('manage_customers') ? `
                            <button onclick="app.requirePin('editCustomer','${c.id}')" class="icon-btn text-blue-600"><i data-lucide="pencil" width="14"></i></button>
                            <button onclick="app.requirePin('deleteDoc','${c.id}','customers')" class="icon-btn text-red-600"><i data-lucide="trash-2" width="14"></i></button>` : '—'}
                        </td>
                    </tr>`).join('')}</tbody>
            </table>`;

        } else if (type === 'expense') {
            container.innerHTML = `
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b text-gray-600">
                    <tr><th class="p-3">Date</th><th class="p-3">Desc</th><th class="p-3">Category</th>
                    <th class="p-3 text-right">Amount</th><th class="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody class="divide-y">${data.map(e => `
                    <tr class="hover:bg-gray-50">
                        <td class="p-3">${new Date(e.date).toLocaleDateString()}</td>
                        <td class="p-3 font-medium">${e.title}</td>
                        <td class="p-3"><span class="bg-gray-100 text-xs px-2 py-1 rounded">${e.category || '-'}</span></td>
                        <td class="p-3 text-right font-medium text-red-600">-${Number(e.amount).toLocaleString()}</td>
                        <td class="p-3 text-right">
                            <button onclick="app.duplicateDoc('${e.id}','expense')" class="icon-btn text-green-600"><i data-lucide="copy" width="14"></i></button>
                            ${can('manage_expenses') ? `<button onclick="app.requirePin('deleteDoc','${e.id}','expenses')" class="icon-btn text-red-600"><i data-lucide="trash-2" width="14"></i></button>` : ''}
                        </td>
                    </tr>`).join('')}</tbody>
            </table>`;

        } else if (type === 'salary') {
            container.innerHTML = `
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b text-gray-600">
                    <tr><th class="p-3">Date</th><th class="p-3">Company</th><th class="p-3">Note</th>
                    <th class="p-3">Method</th><th class="p-3 text-right">Amount</th>
                    <th class="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody class="divide-y">${data.map(s => `
                    <tr class="hover:bg-gray-50">
                        <td class="p-3">${s.date ? new Date(s.date).toLocaleDateString() : '-'}</td>
                        <td class="p-3 font-medium">${s.company || '-'}</td>
                        <td class="p-3">${s.note || '-'}</td>
                        <td class="p-3"><span class="bg-gray-100 text-xs px-2 py-1 rounded">${s.method || '-'}</span></td>
                        <td class="p-3 text-right font-medium text-green-600">+${Number(s.amount).toLocaleString()}</td>
                        <td class="p-3 text-right">
                            ${can('manage_salary') ? `
                            <button onclick="app.requirePin('editSalary','${s.id}')" class="icon-btn text-blue-600"><i data-lucide="pencil" width="14"></i></button>
                            <button onclick="app.requirePin('deleteDoc','${s.id}','salary_incomes')" class="icon-btn text-red-600"><i data-lucide="trash-2" width="14"></i></button>` : '—'}
                        </td>
                    </tr>`).join('')}</tbody>
            </table>`;

        } else {
            // Invoice / Quotation
            container.innerHTML = `
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b text-gray-600">
                    <tr><th class="p-3">ID</th><th class="p-3">Client</th>
                    <th class="p-3 text-right">Amount</th><th class="p-3 text-center">Status</th>
                    <th class="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody class="divide-y">${data.map(item => {
                    const isPaid     = item.status === 'paid';
                    const isPartial  = item.status === 'partial';
                    const isRefunded = item.status === 'refunded';
                    const badge = type === 'quotation'
                        ? '<span class="px-2 py-0.5 rounded text-xs bg-gray-100">QTN</span>'
                        : isRefunded ? '<span class="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">REFUNDED</span>'
                        : isPaid     ? '<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">PAID</span>'
                        : isPartial  ? '<span class="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">PARTIAL</span>'
                        :              '<span class="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">PENDING</span>';
                    const paid = item.payments?.reduce((s, p) => s + p.amount, 0) || 0;
                    const bal  = item.totalAmount - paid;
                    return `<tr class="hover:bg-gray-50 border-b">
                        <td class="p-3 font-medium text-blue-600">${item.invoiceNumber || item.quotationNumber}</td>
                        <td class="p-3">${item.clientName}</td>
                        <td class="p-3 text-right">
                            <div>${Number(item.totalAmount).toLocaleString()}</div>
                            ${type === 'invoice' && bal > 0 && !isRefunded ? `<div class="text-xs text-red-500">Bal: ${bal.toLocaleString()}</div>` : ''}
                        </td>
                        <td class="p-3 text-center">${badge}</td>
                        <td class="p-3 text-right">
                            <div class="flex items-center justify-end gap-1">
                                <button onclick="app.showVerify('${item.id}','${type}')" class="icon-btn"><i data-lucide="printer" width="14"></i></button>
                                ${type === 'invoice' && !isRefunded ? `<button onclick="app.handleStatusClick('${item.id}')" class="icon-btn text-blue-600"><i data-lucide="credit-card" width="14"></i></button>` : ''}
                                ${type === 'invoice' && !isRefunded && can('edit_invoice') ? `<button onclick="app.markRefund('${item.id}')" class="icon-btn text-red-600"><i data-lucide="rotate-ccw" width="14"></i></button>` : ''}
                                ${type === 'quotation' ? `<button onclick="app.convertQuotation('${item.id}')" class="icon-btn text-purple-600"><i data-lucide="arrow-right-circle" width="14"></i></button>` : ''}
                                <button onclick="app.duplicateDoc('${item.id}','${type}')" class="icon-btn text-green-600"><i data-lucide="copy" width="14"></i></button>
                                ${can(`edit_${type}`) ? `<button onclick="app.requirePin('editDoc','${item.id}','${type}')" class="icon-btn text-yellow-600"><i data-lucide="pencil" width="14"></i></button>` : ''}
                                ${can(`delete_${type}`) ? `<button onclick="app.requirePin('deleteDoc','${item.id}','${type}s')" class="icon-btn text-red-600"><i data-lucide="trash-2" width="14"></i></button>` : ''}
                            </div>
                        </td>
                    </tr>`;
                }).join('')}</tbody>
            </table>`;
        }
        if (window.lucide) lucide.createIcons();
    },

    // ── PIN / UNLOCK ──────────────────────────
    requirePin(fnName, ...args) {
        const pw = prompt('Enter PIN code:');
        if (!pw) return;
        const stored = state.settings?.pin || 'admin22';
        if (pw !== stored) { alert('Incorrect PIN'); return; }
        if (typeof app[fnName] === 'function') {
            try { app[fnName](...args); } catch (e) { console.error(e); }
        }
    },

    // ── CREATE / EDIT DOCS ─────────────────────
    createMode(mode) {
        state.mode = mode; state.editingId = null;
        state.items = [{ desc: '', price: 0, qty: 1 }];
        state.discount = 0; state.taxRate = state.settings.taxRate || 0;
        state.initPayment = 0; state.serviceFee = 0;
        app.setView('create');
    },
    createManualInvoice() { app.closeModal(); state.isConverted = false; app.createMode('invoice'); },
    showInvoiceOptionModal() {
        const tpl = document.getElementById('tpl-invoice-option');
        document.getElementById('modal-container').appendChild(tpl.content.cloneNode(true));
        app.translatePage(); if (window.lucide) lucide.createIcons();
    },
    handleCreateButtonClick() {
        const tab = state.activeTab;
        if (tab === 'invoice')    app.showInvoiceOptionModal();
        else if (tab === 'quotation') app.createMode('quotation');
        else if (tab === 'contract')  { state.editingId = null; app.setView('contract-edit'); }
        else if (tab === 'customer')  app.openCustomerModal();
        else if (tab === 'expense')   app.openExpenseModal();
        else if (tab === 'salary')    app.openSalaryModal();
    },

    initCreateForm() {
        document.getElementById('form-title').innerText =
            state.editingId ? `Edit ${state.mode}` : `New ${state.mode}`;
        document.getElementById('form-mode-badge').innerText = state.mode;

        const dl    = document.getElementById('customer-list');
        const dlIds = document.getElementById('customer-ids');
        if (dl)    dl.innerHTML    = state.customers.map(c => `<option value="${c.name}">${c.phone || ''}</option>`).join('');
        if (dlIds) dlIds.innerHTML = state.customers.map(c => `<option value="${c.customerId}">${c.name}</option>`).join('');

        document.getElementById('invoice-payment-section').style.display =
            state.mode === 'quotation' ? 'none' : 'block';

        app.populatePaymentSelects();
        app.renderCreateItems();

        if (!state.editingId) {
            state.taxRate = state.settings.taxRate || 0;
            document.getElementById('tax-input').value     = state.taxRate;
            document.getElementById('service-fee').value   = 0;
            document.getElementById('service-desc').value  = '';
            document.getElementById('doc-number').value    =
                genId(state.mode === 'invoice' ? 'INV' : 'QTN');
            document.getElementById('creation-date').value =
                new Date().toISOString().split('T')[0];
            app.calcTotal();
        }
    },

    async handleSave(e) {
        e.preventDefault();
        const clientName    = document.getElementById('client-name').value;
        const clientId      = document.getElementById('client-db-id').value;
        const docNumber     = document.getElementById('doc-number').value;
        const clientEmail   = document.getElementById('client-email-hidden').value;
        const clientPhone   = document.getElementById('client-phone-hidden').value;
        const clientAddress = document.getElementById('client-address-hidden').value;
        const note          = document.getElementById('doc-note').value;
        const total         = app.calcTotal();
        const col           = state.mode + 's';

        try {
            const docData = {
                clientName, clientId, items: state.items,
                discount: state.discount, taxRate: state.taxRate,
                totalAmount: total, note, clientEmail, clientPhone, clientAddress,
                securityCode: state.editingId
                    ? undefined
                    : `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                createdBy: state.user.uid
            };
            const feeEl  = document.getElementById('service-fee');
            const descEl = document.getElementById('service-desc');
            if (feeEl)  docData.serviceFee  = Number(feeEl.value || 0);
            if (descEl) docData.serviceDesc = descEl.value || '';

            if (state.mode === 'invoice') {
                docData.invoiceNumber = docNumber;
                if (!state.editingId) docData.source = state.isConverted ? 'converted' : 'manual';
            } else {
                docData.quotationNumber = docNumber;
            }
            if (docData.securityCode === undefined) delete docData.securityCode;

            if (state.mode === 'invoice' && !state.editingId) {
                if (state.initPayment > 0) {
                    const m = document.getElementById('init-payment-method').value;
                    docData.payments = [{ amount: state.initPayment, method: m, date: new Date().toISOString() }];
                    docData.status   = state.initPayment >= total ? 'paid' : 'partial';
                    if (docData.status === 'paid') docData.paidAt = serverTimestamp();
                } else {
                    docData.payments = []; docData.status = 'pending';
                }
            }

            if (state.editingId) await updateDoc(cDoc(col, state.editingId), docData);
            else { docData.createdAt = serverTimestamp(); await addDoc(cCol(col), docData); }

            state.activeTab = state.mode;
            app.setView('dashboard');
        } catch (err) { console.error(err); alert(err.message); }
    },

    editDoc(id, type) {
        const d = state[type + 's']?.find(i => i.id === id);
        if (!d) return;
        state.mode = type; state.editingId = id;
        state.items    = JSON.parse(JSON.stringify(d.items));
        state.discount = d.discount || 0;
        state.taxRate  = d.taxRate  || 0;
        app.setView('create');
        setTimeout(() => {
            document.getElementById('client-name').value    = d.clientName;
            document.getElementById('discount-input').value = state.discount;
            document.getElementById('tax-input').value      = state.taxRate;
            document.getElementById('doc-number').value     = d.invoiceNumber || d.quotationNumber;
            document.getElementById('doc-note').value       = d.note || '';
            app.fillCustomerInfo(d.clientName);
            if (document.getElementById('service-fee'))  document.getElementById('service-fee').value  = d.serviceFee  || 0;
            if (document.getElementById('service-desc')) document.getElementById('service-desc').value = d.serviceDesc || '';
            if (type === 'invoice') document.getElementById('init-payment-input').disabled = true;
            app.calcTotal();
        }, 100);
    },

    async deleteDoc(id, coll) {
        if (!confirm('Delete?')) return;
        try { await deleteDoc(cDoc(coll, id)); } catch (e) { console.error(e); alert('Failed to delete.'); }
    },

    async duplicateDoc(id, type) {
        if (!confirm('Duplicate this record?')) return;
        if (type === 'expense') {
            const e = state.expenses.find(x => x.id === id);
            if (e) {
                const nd = { ...e, date: new Date().toISOString().split('T')[0], createdAt: serverTimestamp() };
                delete nd.id; await addDoc(cCol('expenses'), nd);
            }
            return;
        }
        const coll    = type + 's';
        const docData = state[coll]?.find(x => x.id === id);
        if (!docData) return;
        const nd = JSON.parse(JSON.stringify(docData));
        delete nd.id; nd.createdAt = serverTimestamp();
        nd.securityCode = (type==='contract'?'CON-':type==='invoice'?'SEC-':'QTN-') +
            Math.random().toString(36).substring(2, 8).toUpperCase();
        const rnd = Date.now().toString().slice(-6);
        if (type === 'invoice')    { nd.invoiceNumber = 'INV-' + rnd; nd.status = 'pending'; nd.payments = []; nd.source = 'manual'; }
        else if (type === 'quotation') nd.quotationNumber = 'QTN-' + rnd;
        else if (type === 'contract')  nd.quotationNumber = 'CON-' + rnd;

        if (type === 'contract') {
            state.editingId = null; state.mode = 'contract';
            app.setView('contract-edit');
            setTimeout(() => {
                document.getElementById('contract-title').value  = nd.title + ' (Copy)';
                document.getElementById('contract-doc-number').value = nd.quotationNumber;
                document.getElementById('contract-client').value = nd.clientName;
                app.fillCustomerInfo(nd.clientName);
                document.getElementById('contract-editor').innerHTML = nd.content;
            }, 200);
        } else {
            state.items    = nd.items;
            state.discount = nd.discount;
            state.taxRate  = nd.taxRate;
            state.editingId = null; state.mode = type;
            app.setView('create');
            setTimeout(() => {
                document.getElementById('client-name').value = nd.clientName;
                document.getElementById('doc-number').value  = nd.invoiceNumber || nd.quotationNumber;
                document.getElementById('doc-note').value    = nd.note || '';
                app.fillCustomerInfo(nd.clientName);
                app.calcTotal();
            }, 200);
        }
    },

    // ── CUSTOMER ──────────────────────────────
    openCustomerModal(cust = null) {
        const tpl = document.getElementById('tpl-customer-form');
        document.getElementById('modal-container').innerHTML = '';
        document.getElementById('modal-container').appendChild(tpl.content.cloneNode(true));
        app.translatePage();
        if (!cust) document.getElementById('cust-display-id').value = genId('CUST');
        if (cust) {
            document.getElementById('cust-form-title').innerText = 'Edit Customer';
            document.getElementById('cust-id').value          = cust.id;
            document.getElementById('cust-display-id').value  = cust.customerId || genId('CUST');
            document.getElementById('cust-name').value        = cust.name;
            document.getElementById('cust-phone').value       = cust.phone || '';
            document.getElementById('cust-email').value       = cust.email || '';
            document.getElementById('cust-address').value     = cust.address || '';
        }
    },
    async saveCustomer(e) {
        e.preventDefault();
        const id   = document.getElementById('cust-id').value;
        const data = {
            customerId: document.getElementById('cust-display-id').value,
            name:       document.getElementById('cust-name').value,
            phone:      document.getElementById('cust-phone').value,
            email:      document.getElementById('cust-email').value,
            address:    document.getElementById('cust-address').value,
        };
        if (id) await updateDoc(cDoc('customers', id), data);
        else    await addDoc(cCol('customers'), { ...data, createdAt: serverTimestamp() });
        app.closeModal();
    },
    editCustomer(id) { app.openCustomerModal(state.customers.find(c => c.id === id)); },
    fillCustomerInfo(val) {
        const cust    = state.customers.find(c => c.name === val || c.id === val);
        const details = document.getElementById('client-details');
        if (cust) {
            ['client-name','contract-client'].forEach(elId => {
                const el = document.getElementById(elId); if (el) el.value = cust.name;
            });
            const dbId = document.getElementById('client-db-id'); if (dbId) dbId.value = cust.id;
            const idEl = document.getElementById('client-id-input'); if (idEl) idEl.value = cust.customerId || '';
            const ccId = document.getElementById('contract-client-id'); if (ccId) ccId.value = cust.customerId || '';
            const ph   = document.getElementById('client-phone'); if (ph) ph.innerText = cust.phone || '';
            const ad   = document.getElementById('client-address'); if (ad) ad.innerText = cust.address || '';
            const ehEl = document.getElementById('client-email-hidden');   if (ehEl) ehEl.value = cust.email   || '';
            const phEl = document.getElementById('client-phone-hidden');   if (phEl) phEl.value = cust.phone   || '';
            const ahEl = document.getElementById('client-address-hidden'); if (ahEl) ahEl.value = cust.address || '';
            if (details) details.classList.remove('hidden');
        } else {
            const dbId = document.getElementById('client-db-id'); if (dbId) dbId.value = '';
            if (details) details.classList.add('hidden');
        }
    },
    fillCustomerById(val) {
        const c = state.customers.find(x => x.customerId === val);
        if (c) app.fillCustomerInfo(c.name);
    },

    // ── EXPENSE ───────────────────────────────
    openExpenseModal() {
        const tpl = document.getElementById('tpl-expense-form');
        document.getElementById('modal-container').innerHTML = '';
        document.getElementById('modal-container').appendChild(tpl.content.cloneNode(true));
        app.translatePage(); app.populatePaymentSelects();
        document.getElementById('exp-date').valueAsDate = new Date();
        const cats = state.settings.expense_categories || ['Other'];
        document.getElementById('exp-cat').innerHTML = cats.map(c => `<option>${c}</option>`).join('');
    },
    async saveExpense(e) {
        e.preventDefault();
        await addDoc(cCol('expenses'), {
            category:   document.getElementById('exp-cat').value,
            title:      document.getElementById('exp-title').value,
            amount:     Number(document.getElementById('exp-amount').value),
            method:     document.getElementById('exp-method').value,
            date:       document.getElementById('exp-date').value,
            createdAt:  serverTimestamp()
        });
        app.closeModal();
    },

    // ── SALARY ────────────────────────────────
    openSalaryModal(existing = null) {
        state.editingId = existing?.id || null;
        const tpl = document.getElementById('tpl-salary-form');
        document.getElementById('modal-container').innerHTML = '';
        document.getElementById('modal-container').appendChild(tpl.content.cloneNode(true));
        app.translatePage(); app.populatePaymentSelects();
        document.getElementById('sal-form-title').innerText = existing ? 'Edit Salary' : 'Add Salary';
        document.getElementById('sal-date').valueAsDate = new Date();
        const comps = state.settings.companies || [];
        const compSel = document.getElementById('sal-company');
        compSel.innerHTML = comps.map(c => `<option value="${c}">${c}</option>`).join('');
        if (comps.length === 0) compSel.innerHTML = '<option value="">No companies</option>';
        if (existing) {
            document.getElementById('sal-id').value     = existing.id;
            document.getElementById('sal-note').value   = existing.note   || '';
            document.getElementById('sal-amount').value = existing.amount || '';
            if (existing.method) document.getElementById('sal-method').value  = existing.method;
            if (existing.date)   document.getElementById('sal-date').value    = existing.date;
            if (existing.company) compSel.value = existing.company;
        }
    },
    editSalary(id) { app.openSalaryModal(state.salaryIncomes.find(x => x.id === id)); },
    async saveSalary(e) {
        e.preventDefault();
        const id   = document.getElementById('sal-id').value;
        const data = {
            company: document.getElementById('sal-company').value,
            note:    document.getElementById('sal-note').value,
            amount:  Number(document.getElementById('sal-amount').value),
            method:  document.getElementById('sal-method').value,
            date:    document.getElementById('sal-date').value,
        };
        if (id) await updateDoc(cDoc('salary_incomes', id), data);
        else    { data.createdAt = serverTimestamp(); await addDoc(cCol('salary_incomes'), data); }
        app.closeModal(); state.editingId = null;
    },

    // ── PAYMENT ───────────────────────────────
    handleStatusClick(id) {
        const inv = state.invoices.find(x => x.id === id);
        if (!inv) return;
        if (inv.status === 'paid') { app.requirePin('unlockSetInvoicePending', id); return; }
        const paid = inv.payments?.reduce((s, p) => s + p.amount, 0) || 0;
        state.tempInvoice = { ...inv, paid, balance: inv.totalAmount - paid };
        const m = document.getElementById('tpl-payment-modal').content.cloneNode(true);
        document.getElementById('modal-container').innerHTML = '';
        document.getElementById('modal-container').appendChild(m);
        app.translatePage(); app.populatePaymentSelects();
        document.getElementById('modal-total').innerText   = inv.totalAmount.toLocaleString();
        document.getElementById('modal-paid').innerText    = paid.toLocaleString();
        document.getElementById('modal-balance').innerText = state.tempInvoice.balance.toLocaleString();
        document.getElementById('payment-amount').value   = state.tempInvoice.balance;
    },
    async unlockSetInvoicePending(id) {
        await updateDoc(cDoc('invoices', id), { status: 'pending', payments: [] });
    },
    async confirmPayment() {
        const amt  = Number(document.getElementById('payment-amount').value);
        const met  = document.getElementById('payment-method-select').value;
        const inv  = state.tempInvoice;
        const pays = [...(inv.payments || []), { amount: amt, method: met, date: new Date().toISOString() }];
        const stat = pays.reduce((s, p) => s + p.amount, 0) >= inv.totalAmount ? 'paid' : 'partial';
        await updateDoc(cDoc('invoices', inv.id), {
            status: stat, payments: pays, paidAt: stat === 'paid' ? serverTimestamp() : null
        });
        app.closeModal();
    },
    async markRefund(id) {
        if (!confirm(t('refund_confirm'))) return;
        app.requirePin('markRefundConfirmed', id);
    },
    async markRefundConfirmed(id) {
        await updateDoc(cDoc('invoices', id), { status: 'refunded', refundedAt: serverTimestamp() });
    },

    // ── QUOTATION CONVERT ─────────────────────
    convertQuotation(id) {
        const q = state.quotations.find(i => i.id === id);
        if (!q || !confirm('Convert to Invoice?')) return;
        state.mode = 'invoice'; state.editingId = null;
        state.items = JSON.parse(JSON.stringify(q.items));
        state.discount = q.discount || 0; state.taxRate = q.taxRate || 0;
        state.initPayment = 0; state.isConverted = true;
        app.setView('create');
        setTimeout(() => {
            document.getElementById('client-name').value    = q.clientName;
            document.getElementById('discount-input').value = state.discount;
            document.getElementById('tax-input').value      = state.taxRate;
            document.getElementById('doc-number').value     = genId('INV');
            document.getElementById('doc-note').value       = `Ref: ${q.quotationNumber}`;
            app.fillCustomerInfo(q.clientName); app.calcTotal();
        }, 100);
    },
    async importQuotation() {
        const val  = document.getElementById('qtn-import-input').value.trim().toUpperCase();
        const snap = await getDocs(query(cCol('quotations'), where('quotationNumber', '==', val)));
        if (snap.empty) { alert('Not Found'); return; }
        const q = snap.docs[0].data();
        app.closeModal(); state.mode = 'invoice'; state.editingId = null;
        state.items = q.items; state.discount = q.discount || 0;
        state.taxRate = q.taxRate || 0; state.initPayment = 0; state.isConverted = true;
        app.setView('create');
        setTimeout(() => {
            document.getElementById('client-name').value    = q.clientName;
            document.getElementById('discount-input').value = state.discount;
            document.getElementById('doc-number').value     = genId('INV');
            document.getElementById('doc-note').value       = `Ref: ${q.quotationNumber}`;
            app.fillCustomerInfo(q.clientName); app.calcTotal();
        }, 100);
    },

    // ── ITEMS / CALC ──────────────────────────
    renderCreateItems() {
        const c = document.getElementById('items-container');
        c.innerHTML = `<label class="block text-sm font-medium mb-2">${t('items')}</label>`;
        state.items.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'flex gap-2 mb-2 items-start';
            div.innerHTML = `
                <span class="pt-2 text-sm font-bold text-gray-500 w-6">${i + 1}.</span>
                <input placeholder="${t('desc')}" class="flex-grow border p-2 rounded" onchange="app.updateItem(${i},'desc',this.value)" value="${item.desc}">
                <input type="number" placeholder="${t('qty')}" class="w-16 border p-2 rounded" onchange="app.updateItem(${i},'qty',this.value)" value="${item.qty}">
                <input type="number" placeholder="${t('price')}" class="w-24 border p-2 rounded" onchange="app.updateItem(${i},'price',this.value)" value="${item.price}">
                <button type="button" onclick="app.triggerImageUpload(${i})" class="p-2 border rounded"><i data-lucide="camera" width="16"></i></button>
                <button type="button" onclick="app.removeItem(${i})" class="text-red-500 p-2"><i data-lucide="x-circle" width="16"></i></button>`;
            c.appendChild(div);
        });
        if (window.lucide) lucide.createIcons();
        app.calcTotal();
    },
    updateItem(i, f, v) { state.items[i][f] = f === 'desc' ? v : Number(v); app.calcTotal(); },
    addItem()    { state.items.push({ desc: '', price: 0, qty: 1 }); app.renderCreateItems(); },
    removeItem(i){ state.items.splice(i, 1); app.renderCreateItems(); },
    updateCalc(v, t) {
        if (t === 'discount') state.discount    = Number(v);
        if (t === 'tax')      state.taxRate     = Number(v);
        if (t === 'payment')  state.initPayment = Number(v);
        if (t === 'service')  state.serviceFee  = Number(v);
        app.calcTotal();
    },
    calcTotal() {
        const sub = state.items.reduce((s, i) => s + i.price * i.qty, 0);
        const tax = sub * (state.taxRate / 100);
        const tot = sub - state.discount + tax + (state.serviceFee || 0);
        const sd  = document.getElementById('subtotal-display'); if (sd) sd.innerText = sub.toLocaleString();
        const ct  = document.getElementById('create-total');     if (ct) ct.innerText = tot.toLocaleString();
        const cb  = document.getElementById('create-balance');   if (cb) cb.innerText = (tot - state.initPayment).toLocaleString();
        return tot;
    },
    triggerImageUpload(i) { state.uploadingRowIndex = i; document.getElementById('item-image-input').click(); },
    processItemImage(input) { app.processImageBase(input, url => { state.items[state.uploadingRowIndex].image = url; alert('Image Added'); }); },

    // ── PAYMENT METHODS ───────────────────────
    populatePaymentSelects() {
        const methods = state.payment_methods.length ? state.payment_methods : state.defaultMethods;
        document.querySelectorAll('.payment-method-select').forEach(sel => {
            const cur = sel.value;
            sel.innerHTML = methods.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
            if (cur && methods.find(m => m.name === cur)) sel.value = cur;
        });
    },
    addPaymentMethod()  { document.getElementById('payment-method-form').classList.remove('hidden'); },
    async savePaymentMethod() {
        const name = document.getElementById('new-method-name').value.trim();
        if (!name) return;
        await addDoc(cCol('payment_methods'), { name });
        document.getElementById('new-method-name').value = '';
        document.getElementById('payment-method-form').classList.add('hidden');
    },
    async deletePaymentMethod(id) {
        if (confirm('Delete this method?')) await deleteDoc(cDoc('payment_methods', id));
    },
    renderPaymentMethods() {
        const list = document.getElementById('payment-methods-list');
        if (!list) return;
        const methods = state.payment_methods;
        list.innerHTML = methods.length
            ? methods.map(m => `
                <div class="flex justify-between items-center bg-white p-2 border rounded text-sm">
                    <span class="font-medium">${m.name}</span>
                    <button type="button" onclick="app.requirePin('deletePaymentMethod','${m.id}')" class="text-red-600 px-2">
                        <i data-lucide="trash-2" width="14"></i>
                    </button>
                </div>`).join('')
            : '<div class="text-xs text-gray-400 italic">Using defaults (Cash, KPay, Wave, Bank)</div>';
        if (window.lucide) lucide.createIcons();
    },

    // ── SETTINGS ──────────────────────────────
    initSettingsView() {
        app.fillSettingsForm(); app.renderPaymentMethods();
        app.renderExpenseCategories(); app.renderCompaniesSettings();
    },
    fillSettingsForm() {
        const s = state.settings;
        if (s.logo)    document.getElementById('logo-preview').innerHTML = `<img src="${s.logo}" class="h-full object-contain">`;
        if (s.authSign) document.getElementById('sign-preview').innerHTML = `<img src="${s.authSign}" class="h-full object-contain">`;
        document.getElementById('setting-accounts').value    = s.accounts  || '';
        document.getElementById('setting-terms').value       = s.terms     || '';
        document.getElementById('setting-auth-name').value   = s.authName  || '';
        document.getElementById('setting-biz-name').value    = s.bizName   || '';
        document.getElementById('setting-biz-address').value = s.bizAddress|| '';
        document.getElementById('setting-biz-phone').value   = s.bizPhone  || '';
        document.getElementById('setting-biz-web').value     = s.bizWeb    || '';
        document.getElementById('setting-biz-email').value   = s.bizEmail  || '';
        document.getElementById('setting-tax').value         = s.taxRate   || 0;
        document.getElementById('setting-pin').value         = s.pin       || '';
    },
    async handleSaveSettings(e) {
        e.preventDefault();
        const s = state.settings;
        s.accounts   = document.getElementById('setting-accounts').value;
        s.terms      = document.getElementById('setting-terms').value;
        s.authName   = document.getElementById('setting-auth-name').value;
        s.bizName    = document.getElementById('setting-biz-name').value;
        s.bizAddress = document.getElementById('setting-biz-address').value;
        s.bizPhone   = document.getElementById('setting-biz-phone').value;
        s.bizWeb     = document.getElementById('setting-biz-web').value;
        s.bizEmail   = document.getElementById('setting-biz-email').value;
        s.taxRate    = Number(document.getElementById('setting-tax').value);
        s.pin        = document.getElementById('setting-pin').value || 'admin22';
        await setDoc(cDoc('_config', 'general'), s);
        alert('Saved'); app.setView('dashboard');
    },
    renderExpenseCategories() {
        const list = document.getElementById('expense-cats-list');
        if (!list) return;
        const cats = state.settings.expense_categories || [];
        list.innerHTML = cats.map((c, i) => `
            <div class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                ${c}
                <button type="button" onclick="app.removeExpenseCategory(${i})" class="hover:text-purple-900">&times;</button>
            </div>`).join('');
    },
    async addExpenseCategory() {
        const val = prompt('New Category Name:');
        if (val?.trim()) {
            if (!state.settings.expense_categories) state.settings.expense_categories = [];
            state.settings.expense_categories.push(val.trim());
            await setDoc(cDoc('_config', 'general'), state.settings);
            app.renderExpenseCategories();
        }
    },
    async removeExpenseCategory(i) {
        if (!confirm('Remove?')) return;
        state.settings.expense_categories.splice(i, 1);
        await setDoc(cDoc('_config', 'general'), state.settings);
        app.renderExpenseCategories();
    },
    renderCompaniesSettings() {
        const list = document.getElementById('company-list');
        if (!list) return;
        const comps = state.settings.companies || [];
        list.innerHTML = comps.length
            ? comps.map((c, i) => `
                <div class="flex justify-between items-center bg-white p-2 border rounded text-sm">
                    <span class="font-medium">${c}</span>
                    <button type="button" onclick="app.removeCompanySetting(${i})" class="text-red-600 px-2">&times;</button>
                </div>`).join('')
            : '<div class="text-xs text-gray-400 italic">No companies defined</div>';
    },
    addCompanySetting()  { document.getElementById('company-form').classList.remove('hidden'); },
    async saveCompanySetting() {
        const el = document.getElementById('new-company-name');
        const name = el.value.trim();
        if (!name) return;
        if (!state.settings.companies) state.settings.companies = [];
        state.settings.companies.push(name);
        await setDoc(cDoc('_config', 'general'), state.settings);
        el.value = ''; document.getElementById('company-form').classList.add('hidden');
        app.renderCompaniesSettings();
    },
    async removeCompanySetting(i) {
        if (!confirm('Remove?')) return;
        state.settings.companies.splice(i, 1);
        await setDoc(cDoc('_config', 'general'), state.settings);
        app.renderCompaniesSettings();
    },

    // ── CONTRACT EDITOR ───────────────────────
    initContractEditor() {
        setTimeout(() => {
            const dl    = document.getElementById('customer-list');
            const dlIds = document.getElementById('customer-ids');
            if (dl)    dl.innerHTML    = state.customers.map(c => `<option value="${c.name}">${c.phone||''}</option>`).join('');
            if (dlIds) dlIds.innerHTML = state.customers.map(c => `<option value="${c.customerId}">${c.name}</option>`).join('');

            if (state.editingId) {
                const c = state.contracts.find(i => i.id === state.editingId);
                if (c) {
                    document.getElementById('contract-title').value      = c.title || '';
                    document.getElementById('contract-doc-number').value = c.quotationNumber || '';
                    document.getElementById('contract-client').value     = c.clientName || '';
                    app.fillCustomerInfo(c.clientName);
                    document.getElementById('contract-editor').innerHTML = c.content || '';
                    document.getElementById('signer-name').value         = c.signerName     || '';
                    document.getElementById('signer-position').value     = c.signerPosition || '';
                    document.getElementById('signer-business').value     = c.signerBusiness || '';
                    document.getElementById('contract-editor-title').innerText = 'Edit Contract';
                }
            } else {
                document.getElementById('contract-doc-number').value     = genId('CON');
                document.getElementById('contract-editor-title').innerText = 'New Contract';
            }
        }, 100);
    },
    execCmd(cmd, arg = null) { document.getElementById('contract-editor').focus(); document.execCommand(cmd, false, arg); },
    triggerContractImage() { document.getElementById('contract-image-input').click(); },
    processContractImage(input) {
        app.processImageBase(input, url => {
            document.getElementById('contract-editor').focus();
            document.execCommand('insertImage', false, url);
        });
    },
    insertContractTable() {
        const rows = prompt('Rows:', 2); const cols = prompt('Columns:', 2);
        if (!rows || !cols) return;
        let html = '<table style="width:100%;border-collapse:collapse;border:1px solid #ccc"><tbody>';
        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) html += '<td style="border:1px solid #ccc;padding:8px">&nbsp;</td>';
            html += '</tr>';
        }
        html += '</tbody></table><p>&nbsp;</p>';
        document.getElementById('contract-editor').focus();
        document.execCommand('insertHTML', false, html);
    },
    async saveContract() {
        const title    = document.getElementById('contract-title').value;
        const docNum   = document.getElementById('contract-doc-number').value;
        const client   = document.getElementById('contract-client').value;
        const content  = document.getElementById('contract-editor').innerHTML;
        const gv = id => document.getElementById(id)?.value || '';
        if (!title) { alert('Please enter a title'); return; }
        const data = {
            title, clientName: client, content,
            clientEmail: gv('client-email-hidden'), clientPhone: gv('client-phone-hidden'),
            clientAddress: gv('client-address-hidden'),
            signerName: gv('signer-name'), signerPosition: gv('signer-position'), signerBusiness: gv('signer-business'),
            quotationNumber: docNum, createdBy: state.user.uid
        };
        if (!state.editingId) data.securityCode = `CON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        if (state.editingId) await updateDoc(cDoc('contracts', state.editingId), data);
        else { data.createdAt = serverTimestamp(); await addDoc(cCol('contracts'), data); }
        state.activeTab = 'contract'; app.setView('dashboard');
    },
    editContract(id) { state.editingId = id; app.setView('contract-edit'); },

    // ── VERIFY / PAPER ────────────────────────
    showVerify(id, type) {
        const d = state[type + 's']?.find(i => i.id === id);
        if (d) { app.setView('verify'); app.renderPaper(d, type); }
    },
    async handleSearch(v) {
        const q = (v || document.getElementById('search-input')?.value || '').trim();
        if (!q) return;
        app.setView('verify');

        // Search globally across all companies if no companyId, else scoped
        const search = async (basePath, field) => {
            let ref;
            if (state.companyId) {
                ref = query(collection(db, 'companies', state.companyId, basePath), where(field, '==', q));
            } else {
                // Public search: need to find across companies — check invoices globally
                const companiesSnap = await getDocs(collection(db, 'companies'));
                for (const co of companiesSnap.docs) {
                    const s = await getDocs(query(collection(db,'companies',co.id,basePath), where(field,'==',q)));
                    if (!s.empty) return { id: s.docs[0].id, ...s.docs[0].data(), type: basePath.replace('s','') };
                }
                return null;
            }
            const s = await getDocs(ref);
            return s.empty ? null : { id: s.docs[0].id, ...s.docs[0].data(), type: basePath.replace(/s$/,'') };
        };

        let f = await search('invoices','invoiceNumber')
             || await search('quotations','quotationNumber')
             || await search('contracts','quotationNumber')
             || await search('invoices','securityCode')
             || await search('quotations','securityCode')
             || await search('contracts','securityCode');

        if (f) {
            // Load settings for the found document's company
            app.renderPaper(f, f.type);
        } else {
            document.getElementById('verify-content').innerHTML =
                '<div class="p-10 text-center text-red-500 font-bold">Not Found</div>';
        }
    },
    renderPaper(d, t) {
        state.currentDoc = d;
        const code  = d.securityCode || d.invoiceNumber || d.quotationNumber || 'N/A';
        const url   = `${location.origin}${location.pathname}?code=${code}`;
        const qr    = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
        const logo  = state.settings.logo    ? `<img src="${state.settings.logo}" class="h-24 w-auto object-contain">` : '';
        const sign  = state.settings.authSign ? `<img src="${state.settings.authSign}" class="h-16 mx-auto">` : '';
        const bizInfo = `<div class="text-xs text-gray-500 mt-1 leading-none space-y-0">
            ${state.settings.bizAddress ? `<div>${state.settings.bizAddress}</div>` : ''}
            ${state.settings.bizPhone   ? `<div>${state.settings.bizPhone}</div>`   : ''}
            ${state.settings.bizEmail   ? `<div>${state.settings.bizEmail}</div>`   : ''}
            ${state.settings.bizWeb     ? `<div>${state.settings.bizWeb}</div>`     : ''}
        </div>`;

        if (t === 'contract') {
            document.getElementById('verify-content').innerHTML = `
            <div id="contract-paper" class="a4-paper">
                <div class="flex justify-between items-start mb-8 border-b pb-6">
                    <div>${logo}<div class="mt-3">${bizInfo}</div></div>
                    <div class="text-right">
                        <span class="block text-xs text-gray-500 uppercase">Contract No.</span>
                        <span class="block font-bold text-xl text-blue-900">${d.quotationNumber}</span>
                        <span class="text-sm text-gray-500">Date: ${new Date(d.createdAt?.seconds*1000).toLocaleDateString()}</span>
                        <h5 class="mt-2 font-bold text-gray-600 uppercase text-xs">Contract With:</h5>
                        <h3 class="font-bold text-gray-800">${d.clientName}</h3>
                        ${d.clientPhone ? `<div class="text-sm">${d.clientPhone}</div>` : ''}
                        ${d.clientEmail ? `<div class="text-sm">${d.clientEmail}</div>` : ''}
                    </div>
                </div>
                <div class="prose max-w-none mb-12">${d.content}</div>
                <div class="mt-8 pt-4 border-t-2 border-gray-100">
                    <div class="flex justify-between items-end">
                        <div class="text-center w-48">
                            <div class="border-b border-gray-800 mb-1 pb-4"></div>
                            <p class="font-bold text-sm">${d.signerBusiness || d.clientName}</p>
                            <p class="text-xs">${d.signerName || ''}</p>
                            <p class="text-[10px] text-gray-500">${d.signerPosition || 'Authorized Signature'}</p>
                        </div>
                        <div class="text-center w-48">
                            <div class="h-16 flex items-end justify-center">${sign}</div>
                            <div class="border-b border-gray-800 mb-1"></div>
                            <p class="font-bold text-sm">${state.settings.bizName || 'Service Provider'}</p>
                            <p class="text-xs">${state.settings.authName || ''}</p>
                            <p class="text-[10px] text-gray-500">Authorized Signature</p>
                        </div>
                        <img src="${qr}" class="w-16">
                    </div>
                </div>
            </div>`;
            if (window.lucide) lucide.createIcons();
            app.scalePaper(); return;
        }

        document.getElementById('verify-content').innerHTML = `
        <div id="invoice-paper" class="a4-paper">
            <div>
                <div class="flex justify-between border-b pb-6 mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-blue-900 uppercase">${t}</h1>
                        <p class="font-bold text-lg">#${d.invoiceNumber || d.quotationNumber}</p>
                        ${bizInfo}
                    </div>
                    <div class="text-right">${logo}</div>
                </div>
                <div class="flex justify-between mb-8">
                    <div>
                        <h3 class="font-bold text-gray-600 uppercase text-xs mb-1">${resources[state.lang].bill_to}</h3>
                        <p class="font-bold text-lg mb-1">${d.clientName}</p>
                        <div class="text-sm text-gray-500 leading-tight">
                            ${d.clientAddress ? `<div>${d.clientAddress}</div>` : ''}
                            ${d.clientPhone   ? `<div>${d.clientPhone}</div>`   : ''}
                            ${d.clientEmail   ? `<div>${d.clientEmail}</div>`   : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <h3 class="font-bold">${resources[state.lang].date}</h3>
                        <p>${new Date(d.createdAt?.seconds*1000 || Date.now()).toLocaleDateString()}</p>
                        ${t === 'invoice' && d.status === 'refunded' ? '<div class="text-red-600 font-bold border-2 border-red-600 inline-block px-2 mt-2">REFUNDED</div>' : ''}
                        ${t === 'invoice' && d.status === 'paid'     ? '<div class="text-green-700 font-bold border-2 border-green-700 inline-block px-2 mt-2">PAID</div>' : ''}
                        ${t === 'invoice' && d.payments?.length ? `
                        <div class="mt-4 text-xs text-gray-500 text-right">
                            <p class="font-bold mb-1 underline">${resources[state.lang].payment_history}</p>
                            <table class="ml-auto" style="width:auto">
                                ${d.payments.map(p => `<tr><td class="pr-2">${new Date(p.date).toLocaleDateString()}</td><td class="pr-2">(${p.method})</td><td class="font-bold">${p.amount.toLocaleString()}</td></tr>`).join('')}
                            </table>
                        </div>` : ''}
                    </div>
                </div>
                ${d.note ? `<div class="mb-4 p-2 bg-gray-50 text-sm border-l-4 border-gray-300 italic">${d.note}</div>` : ''}
                <table class="w-full mb-6 text-sm invoice-table">
                    <thead><tr>
                        <th class="p-2 text-left">${resources[state.lang].no}</th>
                        <th class="p-2 text-left">${resources[state.lang].desc}</th>
                        <th class="p-2 text-right">${resources[state.lang].qty}</th>
                        <th class="p-2 text-right">${resources[state.lang].price}</th>
                        <th class="p-2 text-right">${resources[state.lang].total}</th>
                    </tr></thead>
                    <tbody>${d.items.map((i, idx) => `
                        <tr>
                            <td class="p-2 text-gray-500">${idx + 1}</td>
                            <td class="p-2"><div>${i.desc}</div>${i.image ? `<img src="${i.image}" class="mt-2 h-16 w-auto object-cover border rounded">` : ''}</td>
                            <td class="p-2 text-right">${i.qty}</td>
                            <td class="p-2 text-right">${i.price.toLocaleString()}</td>
                            <td class="p-2 text-right">${(i.price * i.qty).toLocaleString()}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            <div class="mt-auto">
                <div class="flex justify-between items-start border-t pt-4">
                    <div class="w-1/2 text-sm">
                        <p class="font-bold">${resources[state.lang].payment_info}</p>
                        <pre class="font-sans text-xs whitespace-pre-line">${state.settings.accounts || ''}</pre>
                        <div class="mt-4">
                            <p class="font-bold">${resources[state.lang].terms_conditions}</p>
                            <p class="whitespace-pre-line text-xs text-gray-600">${state.settings.terms || '-'}</p>
                        </div>
                        <div class="mt-4"><img src="${qr}" class="w-20 border p-1"></div>
                    </div>
                    <div class="w-1/3 text-right">
                        <div class="flex justify-between"><span>${resources[state.lang].subtotal}</span><span>${d.items.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()}</span></div>
                        ${d.discount ? `<div class="flex justify-between text-red-500"><span>${resources[state.lang].discount}</span><span>-${d.discount.toLocaleString()}</span></div>` : ''}
                        ${d.taxRate  ? `<div class="flex justify-between text-gray-600"><span>Tax (${d.taxRate}%)</span><span>+${(d.items.reduce((s,i)=>s+i.price*i.qty,0)*(d.taxRate/100)).toLocaleString()}</span></div>` : ''}
                        <div class="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span>${resources[state.lang].total}</span><span>${d.totalAmount.toLocaleString()}</span></div>
                        <div class="mt-10 text-center w-48 ml-auto">
                            ${sign}
                            <p class="text-xs font-bold uppercase mt-1">${state.settings.authName || ''}</p>
                            <div class="border-b border-gray-800 mt-1 mb-1"></div>
                            <p class="text-[10px] text-gray-500">${resources[state.lang].authorized_signature}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-8 text-center text-[10px] text-gray-400 border-t pt-2">
                    ${resources[state.lang].system_generated}
                </div>
            </div>
        </div>`;
        if (window.lucide) lucide.createIcons();
        app.scalePaper();
    },

    scalePaper() {
        const paper = document.querySelector('.a4-paper');
        const cont  = document.querySelector('.paper-container');
        if (!paper || !cont) return;
        const pw = cont.clientWidth - 40;
        if (pw < paper.clientWidth) {
            const s = pw / paper.clientWidth;
            paper.style.transform = `scale(${s})`;
            paper.classList.add('paper-scaler');
            cont.style.height = (paper.offsetHeight * s + 50) + 'px';
        } else {
            paper.style.transform = 'none';
            paper.classList.remove('paper-scaler');
            cont.style.height = 'auto';
        }
    },

    // ── PDF / PRINT ───────────────────────────
    async downloadPDF() {
        const el = document.getElementById('invoice-paper') || document.getElementById('contract-paper');
        if (!el) return;
        const old = el.style.transform; el.style.transform = 'none';
        const canvas = await html2canvas(el, { scale: 2, useCORS: true });
        el.style.transform = old;
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
        const name = state.currentDoc?.invoiceNumber || state.currentDoc?.quotationNumber || 'Document';
        pdf.save(`${name}.pdf`);
    },
    backHome() { app.setView(state.isAdmin && state.companyId ? 'dashboard' : 'home'); },

    // ── QR SCANNER ────────────────────────────
    startScanner() {
        document.getElementById('scanner-modal').classList.remove('hidden');
        state.html5QrCode = new Html5Qrcode('reader');
        state.html5QrCode.start(
            { facingMode: 'environment' }, { fps: 10, qrbox: 250 },
            text => {
                app.stopScanner();
                const u = text.includes('code=') ? new URL(text).searchParams.get('code') : text;
                app.handleSearch(u);
            }
        ).catch(() => {});
    },
    stopScanner() {
        if (state.html5QrCode) state.html5QrCode.stop().then(() => document.getElementById('scanner-modal').classList.add('hidden'));
        else document.getElementById('scanner-modal').classList.add('hidden');
    },

    // ── REPORTS ───────────────────────────────
    renderReports() {
        const container = document.getElementById('dashboard-content');
        if (!container) return;
        Object.values(state.charts).forEach(ch => { try { ch.destroy(); } catch (_) {} });
        state.charts = {};

        const fY = document.getElementById('filter-year')?.value  || 'all';
        const fM = document.getElementById('filter-month')?.value || 'all';
        const fC = document.getElementById('filter-customer')?.value || 'all';

        const checkDate = ts => {
            const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts || 0);
            if (fY !== 'all' && d.getFullYear() != fY) return false;
            if (fM !== 'all' && d.getMonth()    != fM) return false;
            return true;
        };

        const fInv = state.invoices.filter(i => checkDate(i.createdAt) && (fC === 'all' || i.clientName === fC));
        const fExp = state.expenses.filter(e => checkDate(e.date));

        let income = 0, expense = 0, refunds = 0, receivable = 0;
        const clientIncome = {}, expByCat = {};

        fInv.forEach(inv => {
            if (inv.status === 'refunded') {
                refunds += inv.payments?.reduce((s, p) => s + p.amount, 0) || 0;
            } else {
                inv.payments?.forEach(p => {
                    income += p.amount;
                    clientIncome[inv.clientName] = (clientIncome[inv.clientName] || 0) + p.amount;
                });
                const paid = inv.payments?.reduce((s,p)=>s+p.amount,0) || 0;
                if (paid < inv.totalAmount) receivable += inv.totalAmount - paid;
            }
        });

        fExp.forEach(e => {
            expense += Number(e.amount);
            expByCat[e.category || 'Other'] = (expByCat[e.category || 'Other'] || 0) + Number(e.amount);
        });

        const salaryF = state.salaryIncomes.filter(s => checkDate(s.date || s.createdAt));
        const salarySum = salaryF.reduce((s, x) => s + Number(x.amount || 0), 0);
        income += salarySum;

        const netProfit = income - expense;
        const selYear   = fY === 'all' ? new Date().getFullYear() : parseInt(fY);
        const prevYear  = selYear - 1;
        const mInc  = new Array(12).fill(0);
        const mIncP = new Array(12).fill(0);
        const mExp  = new Array(12).fill(0);

        state.invoices.forEach(inv => {
            if (inv.status !== 'refunded') {
                inv.payments?.forEach(p => {
                    const d = new Date(p.date); const m = d.getMonth(); const y = d.getFullYear();
                    if (y === selYear) mInc[m]  += p.amount;
                    if (y === prevYear) mIncP[m] += p.amount;
                });
            }
        });
        fExp.forEach(e => {
            const d = new Date(e.date); const m = d.getMonth(); const y = d.getFullYear();
            if (y === selYear) mExp[m] += Number(e.amount);
        });

        const pmSums = {};
        (state.payment_methods.length ? state.payment_methods : state.defaultMethods)
            .forEach(m => { pmSums[m.name] = { in: 0, out: 0 }; });
        fInv.forEach(inv => inv.payments?.forEach(p => {
            const k = p.method || 'Unknown';
            if (!pmSums[k]) pmSums[k] = { in: 0, out: 0 };
            pmSums[k].in += p.amount;
        }));
        fExp.forEach(e => {
            const k = e.method || 'Unknown';
            if (!pmSums[k]) pmSums[k] = { in: 0, out: 0 };
            pmSums[k].out += Number(e.amount);
        });
        salaryF.forEach(s => {
            const k = s.method || 'Unknown';
            if (!pmSums[k]) pmSums[k] = { in: 0, out: 0 };
            pmSums[k].in += Number(s.amount);
        });

        state.reportPLData = {
            totalIncome: income, totalExpense: expense, netProfit,
            totalReceivable: receivable, totalRefunds: refunds,
            paymentMethodSums: pmSums, year: fY, month: fM, salaryIncomeSum: salarySum
        };

        container.innerHTML = `
        <div class="p-4 bg-gray-50 min-h-screen space-y-6" id="report-body">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button onclick="app.openIncomePanel()" class="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 text-left hover:bg-gray-50">
                    <div class="text-xs text-gray-500 uppercase">${t('income')}</div>
                    <div class="text-xl font-bold text-green-600">${income.toLocaleString()}</div>
                </button>
                <div class="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <div class="text-xs text-gray-500 uppercase">${t('expense_label')}</div>
                    <div class="text-xl font-bold text-red-600">${expense.toLocaleString()}</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div class="text-xs text-gray-500 uppercase">${t('net_profit')}</div>
                    <div class="text-xl font-bold text-blue-600">${netProfit.toLocaleString()}</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <div class="text-xs text-gray-500 uppercase">${t('receivable')}</div>
                    <div class="text-xl font-bold text-yellow-600">${receivable.toLocaleString()}</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                    <div class="text-xs text-gray-500 uppercase">${t('refund_total')}</div>
                    <div class="text-xl font-bold text-orange-600">${refunds.toLocaleString()}</div>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-4 rounded-lg shadow border">
                    <h4 class="font-bold text-gray-600 mb-4 text-sm">Payment Methods</h4>
                    <div class="relative h-64"><canvas id="methodBarChart"></canvas></div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow border">
                    <h4 class="font-bold text-gray-600 mb-4 text-sm">Monthly Income ${selYear} vs ${prevYear}</h4>
                    <div class="relative h-64"><canvas id="lineChart"></canvas></div>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow border overflow-hidden">
                    <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">Expenses by Category</div>
                    <table class="w-full text-sm"><thead class="bg-gray-50 text-xs text-gray-500 uppercase"><tr><th class="p-3 text-left">Category</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">%</th></tr></thead>
                    <tbody class="divide-y">${Object.entries(expByCat).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>`
                        <tr><td class="p-3">${cat}</td>
                        <td class="p-3 text-right text-red-600">${amt.toLocaleString()}</td>
                        <td class="p-3 text-right text-gray-500">${expense > 0 ? Math.round(amt/expense*100)+'%':'0%'}</td></tr>`).join('')}
                    ${Object.keys(expByCat).length===0?'<tr><td colspan="3" class="p-4 text-center text-gray-400">No expenses</td></tr>':''}
                    </tbody></table>
                </div>
                <div class="bg-white rounded-lg shadow border overflow-hidden">
                    <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">By Client</div>
                    <table class="w-full text-sm"><thead class="bg-gray-50 text-xs text-gray-500 uppercase"><tr><th class="p-3 text-left">Client</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">%</th></tr></thead>
                    <tbody class="divide-y">${Object.entries(clientIncome).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([cli,amt])=>`
                        <tr><td class="p-3 font-medium">${cli}</td>
                        <td class="p-3 text-right text-green-600">${amt.toLocaleString()}</td>
                        <td class="p-3 text-right text-gray-500">${income>0?Math.round(amt/income*100)+'%':'0%'}</td></tr>`).join('')}
                    ${Object.keys(clientIncome).length===0?'<tr><td colspan="3" class="p-4 text-center text-gray-400">No data</td></tr>':''}
                    </tbody></table>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border" id="gr-line-container">
                <h4 class="font-bold text-gray-600 mb-4 text-sm">Income vs Expense — ${selYear}</h4>
                <div class="relative h-64"><canvas id="grLineChart"></canvas></div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border">
                <div class="flex justify-between items-center mb-2">
                    <div class="text-xs font-bold text-gray-500 uppercase">P&L Summary</div>
                    <button onclick="app.downloadPLCSV()" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Download CSV</button>
                </div>
                <div class="text-sm space-y-1">
                    <div class="flex justify-between"><span>Total Income</span><span class="font-bold text-green-600">${income.toLocaleString()}</span></div>
                    <div class="flex justify-between"><span>Total Expense</span><span class="font-bold text-red-600">${expense.toLocaleString()}</span></div>
                    <div class="flex justify-between border-t pt-1 mt-1 font-bold"><span>Net Profit</span><span class="text-blue-600">${netProfit.toLocaleString()}</span></div>
                </div>
            </div>
        </div>`;

        const mkChart = () => {
            ['methodBarChart','lineChart','grLineChart'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { const ex = Chart.getChart(el); if (ex) ex.destroy(); }
            });
            Object.values(state.charts).forEach(ch => { try { ch.destroy(); } catch(_){} });
            state.charts = {};
            const ctxM = document.getElementById('methodBarChart')?.getContext('2d');
            const ctxL = document.getElementById('lineChart')?.getContext('2d');
            const ctxG = document.getElementById('grLineChart')?.getContext('2d');
            const mk   = Object.keys(pmSums);
            if (ctxM) state.charts.methodBar = new Chart(ctxM, { type:'bar', data:{labels:mk,datasets:[{label:'In',data:mk.map(k=>pmSums[k].in),backgroundColor:'#10B981'},{label:'Out',data:mk.map(k=>pmSums[k].out),backgroundColor:'#EF4444'}]}, options:{responsive:true,maintainAspectRatio:false}});
            if (ctxL) state.charts.line      = new Chart(ctxL, { type:'bar', data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],datasets:[{label:`${selYear}`,data:mInc,backgroundColor:'#3B82F6'},{label:`${prevYear}`,data:mIncP,backgroundColor:'#9CA3AF'}]}, options:{responsive:true,maintainAspectRatio:false}});
            if (ctxG) state.charts.grLine    = new Chart(ctxG, { type:'line', data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],datasets:[{label:'Income',data:mInc,borderColor:'#10B981',tension:0.3,fill:false},{label:'Expense',data:mExp,borderColor:'#EF4444',tension:0.3,fill:false}]}, options:{responsive:true,maintainAspectRatio:false}});
        };
        setTimeout(mkChart, 50);
    },

    openIncomePanel() {
        const r = state.reportPLData || {};
        const salarySum  = r.salaryIncomeSum || 0;
        const invoiceAmt = (r.totalIncome || 0) - salarySum;
        document.getElementById('modal-container').innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl relative">
                <button onclick="app.closeModal()" class="absolute top-4 right-4 text-gray-400"><i data-lucide="x"></i></button>
                <h3 class="font-bold text-lg mb-4">Income Breakdown</h3>
                <div class="space-y-3">
                    <div class="flex justify-between p-3 bg-blue-50 rounded-lg">
                        <div><div class="font-bold text-blue-800">Invoice Amount</div><div class="text-xs text-blue-600">From customer payments</div></div>
                        <div class="font-bold text-lg text-blue-700">${invoiceAmt.toLocaleString()}</div>
                    </div>
                    <div class="flex justify-between p-3 bg-green-50 rounded-lg">
                        <div><div class="font-bold text-green-800">Salary Amount</div><div class="text-xs text-green-600">From Salary tab</div></div>
                        <div class="font-bold text-lg text-green-700">${salarySum.toLocaleString()}</div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t flex justify-between items-center">
                    <span class="font-bold text-gray-600">Total</span>
                    <span class="font-bold text-2xl">${(r.totalIncome || 0).toLocaleString()}</span>
                </div>
            </div>
        </div>`;
        if (window.lucide) lucide.createIcons();
    },

    downloadPLCSV() {
        const d   = state.reportPLData || {};
        const pms = d.paymentMethodSums || {};
        const rows = [
            ['Item','Value'],
            ['Total Income', d.totalIncome || 0],
            ['Total Expense', d.totalExpense || 0],
            ['Net Profit', d.netProfit || 0],
            ['Receivable', d.totalReceivable || 0],
            ['Refunds', d.totalRefunds || 0], [],
            ['Method','In','Out'],
            ...Object.entries(pms).map(([k, v]) => [k, v.in, v.out])
        ];
        const csv  = rows.map(r => r.map(c => typeof c === 'number' ? c : `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `pl_${d.year}_${d.month}.csv` });
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    },

    closeModal() { document.getElementById('modal-container').innerHTML = ''; },

    // ── IMAGE UTILS ───────────────────────────
    processImageBase(input, cb) {
        if (!input.files[0]) return;
        const r = new FileReader();
        r.onload = e => {
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                const s = 300 / img.width;
                c.width = 300; c.height = img.height * s;
                c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                cb(c.toDataURL('image/png')); input.value = '';
            };
            img.src = e.target.result;
        };
        r.readAsDataURL(input.files[0]);
    },
    processLogo(i)  { app.processImageBase(i, u => { state.settings.logo     = u; document.getElementById('logo-preview').innerHTML = `<img src="${u}" class="h-full">`; }); },
    processSign(i)  { app.processImageBase(i, u => { state.settings.authSign = u; document.getElementById('sign-preview').innerHTML = `<img src="${u}" class="h-full">`; }); },

    // ── MIGRATION (one-time) ──────────────────
    async migrateOldData(targetCompanyId) {
        if (!confirm(`Migrate all old data to company ${targetCompanyId}?\nThis is irreversible.`)) return;
        const colls = ['invoices','quotations','customers','expenses','contracts','salary_incomes','payment_methods'];
        let count = 0;
        for (const coll of colls) {
            const snap = await getDocs(collection(db, coll));
            const batch = writeBatch(db);
            snap.docs.forEach(d => {
                if (d.id === 'config_general') return; // skip old config
                const newRef = doc(db, 'companies', targetCompanyId, coll, d.id);
                batch.set(newRef, d.data());
                count++;
            });
            await batch.commit();
        }
        // Migrate settings
        const oldConfig = await getDoc(doc(db, 'invoices', 'config_general'));
        if (oldConfig.exists()) {
            await setDoc(doc(db, 'companies', targetCompanyId, '_config', 'general'), oldConfig.data());
        }
        alert(`Migration complete! ${count} documents moved.`);
    },

    // Wrapper — called from Settings button (no args needed)
    runMigration() {
        if (!state.companyId) {
            alert('Please select a company first.');
            return;
        }
        app.migrateOldData(state.companyId);
    }
};

window.app = app;
export default app;
