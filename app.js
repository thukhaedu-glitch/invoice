 <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getAuth, signInAnonymously, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
        import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, setDoc, getDoc, onSnapshot, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyBz5Cm-qsKe9pshGLaBkzw0WTOg9OLDwHk",
            authDomain: "invoice-99bdb.firebaseapp.com",
            projectId: "invoice-99bdb",
            storageBucket: "invoice-99bdb.firebasestorage.app",
            messagingSenderId: "1055209115726",
            appId: "1:1055209115726:web:926791697e6ad783e5b31f"
        };

        const appInstance = initializeApp(firebaseConfig);
        const auth = getAuth(appInstance);
        const db = getFirestore(appInstance);

        // Default PIN code for all protected operations
        const DEFAULT_PIN = 'admin22';

        const resources = {
            en: {
                verify_payment_title: "Verify Payment",
                method_1: "Method 1 - Enter Number",
                method_2: "Method 2 - Scan QR Code",
                use_camera: "Use Camera to Scan",
                admin_login_link: "Admin Click Here",
                check_btn: "Check",
                scan_qr: "Scan QR Code",
                admin_login: "Admin Login",
                login_btn: "Login",
                home: "Home",
                dashboard: "Dashboard",
                logout: "Logout",
                invoices: "Invoices",
                quotations: "Quotations",
                contracts: "Contracts",
                customers: "Customers",
                expenses: "Expenses",
                reports: "Reports",
                settings: "Settings",
                year: "Year",
                month: "Month",
                customer: "Customer",
                filter_btn: "Filter",
                create_new: "Create New",
                client_name: "Client Name",
                items: "Items",
                add_item: "Add Item",
                subtotal: "Subtotal:",
                discount: "Discount (Ks):",
                total: "Total:",
                deposit: "Payment / Deposit:",
                balance: "Balance:",
                cancel: "Cancel",
                save: "Save",
                add_customer: "Add Customer",
                add_expense: "Add Expense",
                logo: "Company Logo",
                change_logo: "Change Logo",
                auth_name: "Auth Person Name",
                auth_sign: "Auth Signature",
                upload: "Upload",
                payment_accounts: "Payment Footer Info",
                terms: "Terms / Note",
                save_settings: "Save Settings",
                back: "Back",
                print: "Print",
                add_payment: "Add Payment",
                paid: "Paid:",
                confirm: "Confirm",
                create_invoice: "Create Invoice",
                manual_invoice: "Manual Invoice",
                from_quotation: "From Quotation",
                load: "Load",
                edit_contract: "Contract Editor",
                financial_overview: "Financial Overview",
                income: "Income",
                expense_label: "Expenses",
                net_profit: "Net Profit",
                receivable: "Receivable",
                refund_total: "Total Refunded",
                method_breakdown: "Method Breakdown",
                quotation_stats: "Quotation Stats",
                total_created: "Total Created",
                converted: "Converted to Invoices",
                bill_to: "Bill To:",
                date: "Date:",
                payment_history: "Payment History",
                payment_info: "Payment Info:",
                terms_conditions: "Terms & Conditions:",
                system_generated: "This invoice is system generated and is valid without a seal.",
                authorized_signature: "Authorized Signature",
                desc: "Description",
                qty: "Qty",
                price: "Price",
                no: "No.",
                refund_confirm: "Mark this invoice as REFUNDED? This cannot be undone.",
                source_breakdown: "Invoice Source Breakdown",
                manual: "Manual Invoices",
                from_qtn: "Converted from Quote",
                status: "Status"
            },
            my: {
                verify_payment_title: "ငွေပေးချေမှု စစ်ဆေးရန်",
                method_1: "နည်းလမ်း (၁) - နံပါတ်ရိုက်ထည့်ရန်",
                method_2: "နည်းလမ်း (၂) - QR Code ဖတ်ရန်",
                use_camera: "ကင်မရာအသုံးပြု၍ စစ်ဆေးပါ",
                admin_login_link: "Admin ဝင်ရန် နှိပ်ပါ",
                check_btn: "စစ်ဆေးမည်",
                scan_qr: "QR Code ဖတ်ရန်",
                admin_login: "Admin ဝင်ရောက်ရန်",
                login_btn: "ဝင်ရောက်မည်",
                home: "မူလစာမျက်နှာ",
                dashboard: "ဒက်ရှ်ဘုတ်",
                logout: "ထွက်မည်",
                invoices: "အင်ဗွိုက်များ",
                quotations: "ကိုတေးရှင်းများ",
                contracts: "စာချုပ်များ",
                customers: "ဖောက်သည်များ",
                expenses: "ကုန်ကျစရိတ်များ",
                reports: "စာရင်းချုပ်",
                settings: "ဆက်တင်များ",
                year: "ခုနှစ်",
                month: "လ",
                customer: "ဖောက်သည်",
                filter_btn: "ကြည့်မည်",
                create_new: "အသစ်ဖန်တီးမည်",
                client_name: "ဖောက်သည် အမည်",
                items: "ပစ္စည်းစာရင်း",
                add_item: "ပစ္စည်းထပ်ထည့်မည်",
                subtotal: "စုစုပေါင်း (လျော့စျေးမပါ):",
                discount: "လျော့စျေး (ကျပ်):",
                total: "စုစုပေါင်း:",
                deposit: "စရန် / ပေးချေငွေ:",
                balance: "ကျန်ငွေ:",
                cancel: "မလုပ်တော့ပါ",
                save: "သိမ်းမည်",
                add_customer: "ဖောက်သည်အသစ်ထည့်ရန်",
                add_expense: "စရိတ်စာရင်းသွင်းရန်",
                logo: "လုပ်ငန်းလိုဂို",
                change_logo: "လိုဂိုပြောင်းမည်",
                auth_name: "တာဝန်ခံ အမည်",
                auth_sign: "လက်မှတ်",
                upload: "တင်မည်",
                payment_accounts: "ငွေလွှဲရန် အချက်အလက်များ (အောက်ခြေ)",
                terms: "စည်းကမ်းချက် / မှတ်ချက်",
                save_settings: "ဆက်တင်သိမ်းမည်",
                back: "နောက်သို့",
                print: "ပရင့်ထုတ်မည်",
                add_payment: "ငွေလက်ခံမည်",
                paid: "ပေးချေပြီး:",
                confirm: "အတည်ပြုမည်",
                create_invoice: "Invoice ဖွင့်မည်",
                manual_invoice: "Manual Invoice ဖွင့်မည်",
                from_quotation: "Quotation မှ ပြောင်းမည်",
                load: "ရှာဖွေမည်",
                edit_contract: "စာချုပ်ရေးသားရန်",
                financial_overview: "ဘဏ္ဍာရေး သုံးသပ်ချက်",
                income: "ဝင်ငွေ",
                expense_label: "ထွက်ငွေ (စရိတ်)",
                net_profit: "အသားတင်အမြတ်",
                receivable: "ရရန်ရှိ (ကြွေးကျန်)",
                refund_total: "ပြန်အမ်းငွေ စုစုပေါင်း",
                method_breakdown: "ငွေပေးချေမှုပုံစံ ခွဲခြမ်းစိတ်ဖြာခြင်း",
                quotation_stats: "Quotation အခြေအနေ",
                total_created: "စုစုပေါင်း အရေအတွက်",
                converted: "Invoice ပြောင်းပြီး",
                bill_to: "ဝယ်ယူသူ အမည်:",
                date: "ရက်စွဲ:",
                payment_history: "ပေးချေမှု မှတ်တမ်း",
                payment_info: "ငွေပေးချေရန်:",
                terms_conditions: "စည်းကမ်းချက်များ:",
                system_generated: "ဤဘောက်ချာသည် စနစ်မှ အလိုအလျောက် ထုတ်ထားခြင်းဖြစ်၍ တံဆိပ်တုံးမပါဘဲ အတည်ဖြစ်သည်။",
                authorized_signature: "တာဝန်ခံ လက်မှတ်",
                desc: "အမျိုးအမည်",
                qty: "အရေအတွက်",
                price: "ဈေးနှုန်း",
                no: "စဉ်",
                refund_confirm: "ဤ Invoice ကို ငွေပြန်အမ်း (Refund) အဖြစ် သတ်မှတ်မည်လား? ပြန်ပြင်၍ မရပါ။",
                source_breakdown: "Invoice အမျိုးအစား ခွဲခြမ်းစိတ်ဖြာခြင်း",
                manual: "Manual ဖွင့်သော Invoices",
                from_qtn: "Quotation မှပြောင်းသော Invoices",
                status: "အခြေအနေ"
            }
        };

        const state = {
            user: null, isAdmin: false, view: 'home', activeTab: 'invoice', mode: 'invoice',
            invoices: [], quotations: [], customers: [], expenses: [], contracts: [], payment_methods: [], adjustments: [],
            currentDoc: null, items: [{desc: '', price: 0, qty: 1, image: null}],
            discount: 0, taxRate: 0, initPayment: 0, serviceFee: 0, tempInvoice: null, html5QrCode: null, editingId: null,
            unlockPassword: null, uploadingRowIndex: null,
            settings: { logo: null, accounts: '', terms: '', authName: '', authSign: null, bizAddress: '', bizPhone: '', bizWeb: '', bizEmail: '', bizName: '', taxRate: 0, expense_categories: [] },
            lang: localStorage.getItem('appLang') || 'en',
            defaultMethods: [{name: 'Cash'}, {name: 'KPay'}, {name: 'Wave'}, {name: 'Bank'}],
            isConverted: false,
            filters: { year: 'all', month: 'all', customer: 'all', status: 'all' },
            charts: {},
            salaryIncomes: []
        };

        const app = {
            init: () => {
                app.updateLangButton();
                onAuthStateChanged(auth, async (u) => {
                    if (u) {
                        state.user = u; state.isAdmin = !u.isAnonymous;
                        if(state.isAdmin) {
                            app.listenCollection('invoices');
                            app.listenCollection('quotations');
                            app.listenCollection('customers');
                            app.listenCollection('expenses');
                            app.listenCollection('adjustments');
                            app.listenCollection('contracts');
                                app.listenCollection('salary_incomes');
                            app.listenCollection('payment_methods');
                        }
                    } else { try { await signInAnonymously(auth); } catch(e){} }
                    
                    const params = new URLSearchParams(window.location.search);
                    if(params.get('id') || params.get('code')) app.handleSearch(params.get('code') || params.get('id'));
                    else app.setView('home');
                });
                app.listenSettings();
                lucide.createIcons();
                window.addEventListener('resize', app.scalePaper);
            },

            scalePaper: () => {
                const paper = document.querySelector('.a4-paper');
                const container = document.querySelector('.paper-container');
                if (paper && container) {
                    const margin = 20; 
                    const parentWidth = container.clientWidth - (margin * 2);
                    const paperWidth = paper.clientWidth; 
                    
                    if (parentWidth < paperWidth) {
                        const scale = parentWidth / paperWidth;
                        paper.style.transform = `scale(${scale})`;
                        paper.classList.add('paper-scaler');
                        const scaledHeight = paper.offsetHeight * scale;
                        container.style.height = (scaledHeight + 50) + 'px'; 
                    } else {
                        paper.style.transform = 'none';
                        paper.classList.remove('paper-scaler');
                        container.style.height = 'auto';
                    }
                }
            },

            t: (key) => resources[state.lang][key] || key,
            toggleLang: () => {
                state.lang = state.lang === 'en' ? 'my' : 'en';
                localStorage.setItem('appLang', state.lang);
                app.updateLangButton();
                app.setView(state.view);
            },
            updateLangButton: () => {
                const icon = document.getElementById('lang-icon');
                const text = document.getElementById('lang-text');
                if(icon && text) {
                    icon.innerText = state.lang === 'en' ? '🇬🇧' : '🇲🇲';
                    text.innerText = state.lang === 'en' ? 'EN' : 'MY';
                }
            },
            translatePage: () => {
                document.querySelectorAll('[data-translate]').forEach(el => {
                    const key = el.getAttribute('data-translate');
                    el.innerText = app.t(key);
                });
            },

            listenCollection: (coll) => {
                onSnapshot(collection(db, coll), (snapshot) => {
                    const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data(), type: coll.slice(0,-1)}));
                    // map collection name to state key (salary_incomes -> salaryIncomes)
                    const targetKey = coll === 'salary_incomes' ? 'salaryIncomes' : coll;
                    state[targetKey] = items;
                    if (coll !== 'payment_methods') {
                        state[targetKey].sort((a,b) => {
                            const tA = a.createdAt?.seconds || new Date(a.date).getTime()/1000 || 0;
                            const tB = b.createdAt?.seconds || new Date(b.date).getTime()/1000 || 0;
                            return tB - tA;
                        });
                    }
                    if(state.view === 'dashboard' && state.activeTab === coll.slice(0,-1)) app.applyFilters();
                    if(state.view === 'dashboard' && state.activeTab === 'report') app.renderReports();
                    if(coll === 'payment_methods' && state.view === 'settings') app.renderPaymentMethods();
                });
            },

            listenSettings: () => {
                onSnapshot(doc(db, 'invoices', 'config_general'), (doc) => {
                    if (doc.exists()) {
                        state.settings = doc.data();
                        // Populate default expense categories if missing
                        if(!state.settings.expense_categories || state.settings.expense_categories.length === 0) {
                            state.settings.expense_categories = ['Food', 'Transportation', 'Salary', 'Rent', 'Marketing', 'Utility', 'Other'];
                        }
                        if (state.view === 'verify' && state.currentDoc) {
                            app.renderPaper(state.currentDoc, state.currentDoc.type); 
                        }
                    }
                });
            },

            setView: (viewName) => {
                state.view = viewName;
                const main = document.getElementById('main-container');
                const tpl = document.getElementById(`tpl-${viewName}`);
                if((viewName === 'dashboard' || viewName === 'settings' || viewName === 'contract-edit') && !state.isAdmin) return app.setView('login');
                main.innerHTML = ''; main.appendChild(tpl.content.cloneNode(true));
                
                app.translatePage();
                app.updateLangButton();
                lucide.createIcons();

                if(viewName === 'dashboard') app.switchTab(state.activeTab);
                if(viewName === 'settings') app.initSettingsView();
                if(viewName === 'create') app.initCreateForm();
                if(viewName === 'contract-edit') app.initContractEditor();
                if(viewName === 'verify') setTimeout(app.scalePaper, 100);
            },

            initContractEditor: () => {
                setTimeout(() => {
                    const titleInput = document.getElementById('contract-title');
                    const docNumInput = document.getElementById('contract-doc-number');
                    const clientInput = document.getElementById('contract-client');
                    const clientIdInput = document.getElementById('contract-client-id');
                    const editor = document.getElementById('contract-editor');
                    const headerTitle = document.getElementById('contract-editor-title');
                    
                    const signerNameInput = document.getElementById('signer-name');
                    const signerPosInput = document.getElementById('signer-position');
                    const signerBizInput = document.getElementById('signer-business');
                    
                    const dl = document.getElementById('customer-list');
                    const dlIds = document.getElementById('customer-ids');
                    
                    if(dl) dl.innerHTML = state.customers.map(c => `<option value="${c.name}">${c.phone || ''}</option>`).join('');
                    if(dlIds) dlIds.innerHTML = state.customers.map(c => `<option value="${c.customerId}">${c.name}</option>`).join('');

                    if(state.editingId) {
                        if(headerTitle) headerTitle.innerText = "Edit Contract";
                        const c = state.contracts.find(i => i.id === state.editingId);
                        if(c) {
                            titleInput.value = c.title || '';
                            docNumInput.value = c.quotationNumber || '';
                            clientInput.value = c.clientName || '';
                            
                            app.fillCustomerInfo(c.clientName);
                            const cust = state.customers.find(x => x.name === c.clientName);
                            if(clientIdInput) clientIdInput.value = cust ? cust.customerId : '';
                            
                            editor.innerHTML = c.content || '';
                            
                            if(signerNameInput) signerNameInput.value = c.signerName || '';
                            if(signerPosInput) signerPosInput.value = c.signerPosition || '';
                            if(signerBizInput) signerBizInput.value = c.signerBusiness || '';
                        }
                    } else {
                        if(headerTitle) headerTitle.innerText = "New Contract";
                        docNumInput.value = 'CON-' + Date.now().toString().slice(-6);
                        titleInput.value = '';
                        clientInput.value = '';
                        if(clientIdInput) clientIdInput.value = '';
                        editor.innerHTML = '';
                        if(signerNameInput) signerNameInput.value = '';
                        if(signerPosInput) signerPosInput.value = '';
                        if(signerBizInput) signerBizInput.value = '';
                    }
                }, 100);
            },

            execCmd: (cmd, arg = null) => {
                document.getElementById('contract-editor').focus();
                document.execCommand(cmd, false, arg);
            },

            triggerContractImage: () => document.getElementById('contract-image-input').click(),
            processContractImage: (input) => {
                app.processImageBase(input, (url) => {
                    document.getElementById('contract-editor').focus();
                    document.execCommand('insertImage', false, url);
                });
            },

            insertContractTable: () => {
                const rows = prompt("Rows:", 2);
                const cols = prompt("Columns:", 2);
                if(rows && cols) {
                    let html = '<table style="width:100%; border-collapse: collapse; border: 1px solid #ccc;"><tbody>';
                    for(let r=0; r<rows; r++) {
                        html += '<tr>';
                        for(let c=0; c<cols; c++) {
                            html += '<td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>';
                        }
                        html += '</tr>';
                    }
                    html += '</tbody></table><p>&nbsp;</p>';
                    document.getElementById('contract-editor').focus();
                    document.execCommand('insertHTML', false, html);
                }
            },

            tableAction: (action) => {
                const sel = window.getSelection();
                if (!sel.rangeCount) return;
                let node = sel.getRangeAt(0).startContainer;
                while (node && node.nodeName !== 'TD' && node.nodeName !== 'TH') {
                    node = node.parentNode;
                }
                if (!node) return alert("Please place cursor inside a table cell.");
                
                const cell = node;
                const row = cell.parentNode;
                const table = row.parentNode.parentNode;
                const cellIndex = cell.cellIndex;
                const rowIndex = row.rowIndex;

                if (action === 'insertRow') {
                    const newRow = table.insertRow(rowIndex + 1);
                    for (let i = 0; i < row.cells.length; i++) {
                        const newCell = newRow.insertCell(i);
                        newCell.innerHTML = '&nbsp;';
                        newCell.style.border = '1px solid #d1d5db';
                        newCell.style.padding = '8px';
                    }
                } else if (action === 'insertCol') {
                    for (let i = 0; i < table.rows.length; i++) {
                        const newCell = table.rows[i].insertCell(cellIndex + 1);
                        newCell.innerHTML = '&nbsp;';
                        newCell.style.border = '1px solid #d1d5db';
                        newCell.style.padding = '8px';
                    }
                } else if (action === 'deleteRow') {
                    table.deleteRow(rowIndex);
                } else if (action === 'deleteCol') {
                    for (let i = 0; i < table.rows.length; i++) {
                        if (table.rows[i].cells.length > cellIndex) {
                            table.rows[i].deleteCell(cellIndex);
                        }
                    }
                } else if (action === 'mergeRight') {
                    if (cell.nextElementSibling) {
                        const nextCell = cell.nextElementSibling;
                        const content = nextCell.innerHTML;
                        cell.colSpan = (cell.colSpan || 1) + (nextCell.colSpan || 1);
                        cell.innerHTML += ' ' + content;
                        nextCell.remove();
                    }
                } else if (action === 'mergeDown') {
                    const nextRow = row.nextElementSibling;
                    if (nextRow && nextRow.cells[cellIndex]) {
                        const belowCell = nextRow.cells[cellIndex];
                        const content = belowCell.innerHTML;
                        cell.rowSpan = (cell.rowSpan || 1) + (belowCell.rowSpan || 1);
                        cell.innerHTML += ' ' + content;
                        belowCell.remove();
                    }
                }
            },

            saveContract: async () => {
                const title = document.getElementById('contract-title').value;
                const docNum = document.getElementById('contract-doc-number').value;
                const clientName = document.getElementById('contract-client').value;
                const content = document.getElementById('contract-editor').innerHTML;
                
                const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : '';
                const clientEmail = getVal('client-email-hidden');
                const clientPhone = getVal('client-phone-hidden');
                const clientAddress = getVal('client-address-hidden');
                
                const signerName = getVal('signer-name');
                const signerPosition = getVal('signer-position');
                const signerBusiness = getVal('signer-business');

                if(!title) return alert("Please enter a title");

                const data = {
                    title, clientName, content,
                    clientEmail, clientPhone, clientAddress,
                    signerName, signerPosition, signerBusiness,
                    quotationNumber: docNum,
                    securityCode: state.editingId ? undefined : `CON-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
                    createdBy: state.user.uid
                };
                if(data.securityCode === undefined) delete data.securityCode;

                if (state.editingId) await updateDoc(doc(db, 'contracts', state.editingId), data);
                else {
                    await addDoc(collection(db, 'contracts'), {...data, createdAt: serverTimestamp()});
                }
                state.activeTab = 'contract';
                app.setView('dashboard');
            },

            initSettingsView: () => {
                app.fillSettingsForm();
                app.renderPaymentMethods();
                app.renderExpenseCategories();
                app.renderCompanies();
            },

            renderPaymentMethods: () => {
                const list = document.getElementById('payment-methods-list');
                if(!list) return;
                const methods = state.payment_methods.length > 0 ? state.payment_methods : [];
                
                list.innerHTML = methods.map(m => `
                    <div class="flex justify-between items-center bg-white p-2 border rounded text-sm">
                        <span class="font-medium">${m.name}</span>
                        <div>
                            <button type="button" onclick="app.requireUnlockAndThen('deletePaymentMethod','${m.id}')" class="text-red-600 hover:text-red-800 px-2">
                                <i data-lucide="trash-2" width="14"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                if(methods.length === 0) list.innerHTML = `<div class="text-xs text-gray-400 italic">No custom methods. Using defaults (Cash, KPay, etc.)</div>`;
                lucide.createIcons();
            },

            renderExpenseCategories: () => {
                const list = document.getElementById('expense-cats-list');
                if(!list) return;
                const cats = state.settings.expense_categories || [];
                list.innerHTML = cats.map((c, i) => `
                    <div class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        ${c}
                        <button type="button" onclick="app.removeExpenseCategory(${i})" class="hover:text-purple-900">&times;</button>
                    </div>
                `).join('');
                lucide.createIcons();
            },

            renderCompanies: () => {
                const list = document.getElementById('company-list');
                if(!list) return;
                const comps = state.settings.companies || [];
                list.innerHTML = comps.map((c, i) => `
                    <div class="flex justify-between items-center bg-white p-2 border rounded text-sm">
                        <span class="font-medium">${c}</span>
                        <div>
                            <button type="button" onclick="app.removeCompany(${i})" class="text-red-600 hover:text-red-800 px-2">&times;</button>
                        </div>
                    </div>
                `).join('');
                if(comps.length === 0) list.innerHTML = `<div class="text-xs text-gray-400 italic">No companies defined</div>`;
            },

            addCompany: () => document.getElementById('company-form').classList.remove('hidden'),

            saveCompany: async () => {
                const nameEl = document.getElementById('new-company-name');
                const name = nameEl.value.trim();
                if(!name) return;
                if(!state.settings.companies) state.settings.companies = [];
                state.settings.companies.push(name);
                await setDoc(doc(db, 'invoices', 'config_general'), state.settings);
                nameEl.value = '';
                document.getElementById('company-form').classList.add('hidden');
                app.renderCompanies();
            },

            removeCompany: async (index) => {
                if(!confirm('Remove this company?')) return;
                state.settings.companies.splice(index, 1);
                await setDoc(doc(db, 'invoices', 'config_general'), state.settings);
                app.renderCompanies();
            },

            addExpenseCategory: async () => {
                const val = prompt("New Category Name:");
                if(val && val.trim()) {
                    if(!state.settings.expense_categories) state.settings.expense_categories = [];
                    state.settings.expense_categories.push(val.trim());
                    await setDoc(doc(db, 'invoices', 'config_general'), state.settings);
                    app.renderExpenseCategories();
                }
            },

            removeExpenseCategory: async (index) => {
                if(confirm("Remove this category?")) {
                    state.settings.expense_categories.splice(index, 1);
                    await setDoc(doc(db, 'invoices', 'config_general'), state.settings);
                    app.renderExpenseCategories();
                }
            },

            addPaymentMethod: () => document.getElementById('payment-method-form').classList.remove('hidden'),

            savePaymentMethod: async () => {
                const name = document.getElementById('new-method-name').value.trim();
                if(!name) return;
                await addDoc(collection(db, 'payment_methods'), { name });
                document.getElementById('new-method-name').value = '';
                document.getElementById('payment-method-form').classList.add('hidden');
            },

            deletePaymentMethod: async (id) => {
                if(confirm("Delete this method?")) await deleteDoc(doc(db, 'payment_methods', id));
            },

            populatePaymentSelects: () => {
                const selects = document.querySelectorAll('.payment-method-select');
                const methods = state.payment_methods.length > 0 ? state.payment_methods : state.defaultMethods;
                
                selects.forEach(sel => {
                    const currentVal = sel.value; 
                    sel.innerHTML = methods.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
                    if(currentVal && methods.find(m => m.name === currentVal)) sel.value = currentVal;
                });
            },

            showVerify: (id, type) => {
                const coll = type + 's';
                const d = state[coll].find(i => i.id === id);
                if(d) {
                    app.setView('verify');
                    app.renderPaper(d, type);
                }
            },

            switchTab: (tab) => {
                state.activeTab = tab;
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.className = `tab-btn whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${b.id === 'tab-'+tab ? 'bg-white border shadow-sm text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`;
                });
                
                const actionBar = document.getElementById('action-bar');
                const genericFilters = document.getElementById('generic-filters');
                
                if (tab === 'customer' || tab === 'settings') {
                    if(genericFilters) genericFilters.style.display = 'none';
                } else {
                    if(genericFilters) {
                        genericFilters.style.display = 'flex';
                        app.initGenericFilters();
                    }
                }

                if (tab === 'expense') {
                    document.getElementById('filter-customer-wrapper').style.display = 'none';
                } else {
                    if(document.getElementById('filter-customer-wrapper')) document.getElementById('filter-customer-wrapper').style.display = 'block';
                }

                // Show/Hide Invoice Status Filter
                if (tab === 'invoice') {
                    document.getElementById('filter-status-wrapper').classList.remove('hidden');
                } else {
                    document.getElementById('filter-status-wrapper').classList.add('hidden');
                }

                if(tab === 'report') {
                    if(actionBar) actionBar.style.display = 'none';
                    app.renderReports();
                } else if (tab === 'salary') {
                    if(actionBar) actionBar.style.display = 'flex';
                    app.renderSalaryList();
                } else {
                    if(actionBar) actionBar.style.display = 'flex';
                    if(document.getElementById('create-btn-text')) document.getElementById('create-btn-text').innerText = `${app.t('create_new')}`;
                    app.applyFilters();
                }
            },

            // --- Generic Filter Logic ---
            initGenericFilters: () => {
                const yearSelect = document.getElementById('filter-year');
                const custSelect = document.getElementById('filter-customer');
                const compSelect = document.getElementById('filter-company');
                
                if(yearSelect.options.length === 0) {
                    const currentYear = new Date().getFullYear();
                    yearSelect.innerHTML = `<option value="all">All Years</option>`;
                    for(let i=currentYear-2; i<=currentYear+1; i++) {
                        yearSelect.innerHTML += `<option value="${i}" ${i===currentYear?'selected':''}>${i}</option>`;
                    }
                }
                
                custSelect.innerHTML = `<option value="all">All Customers</option>` + state.customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
                if(compSelect) compSelect.innerHTML = `<option value="all">All Companies</option>` + ((state.settings && state.settings.companies) ? state.settings.companies.map(c => `<option value="${c}">${c}</option>`).join('') : '');
                
                if(state.filters.year) yearSelect.value = state.filters.year;
                if(state.filters.month) document.getElementById('filter-month').value = state.filters.month;
                if(state.filters.customer) custSelect.value = state.filters.customer;
                if(state.filters.company && compSelect) compSelect.value = state.filters.company;
                if(state.filters.status) document.getElementById('filter-status').value = state.filters.status;
            },

            applyFilters: () => {
                state.filters.year = document.getElementById('filter-year').value;
                state.filters.month = document.getElementById('filter-month').value;
                state.filters.customer = document.getElementById('filter-customer').value;
                const compEl = document.getElementById('filter-company');
                state.filters.company = compEl ? compEl.value : 'all';
                state.filters.status = document.getElementById('filter-status').value;

                if (state.activeTab === 'report') {
                    app.renderReports();
                    return;
                }

                let allData = [];
                if(state.activeTab === 'salary') allData = state.salaryIncomes || [];
                else allData = state[state.activeTab + 's'] || [];
                const fYear = state.filters.year;
                const fMonth = state.filters.month;
                const fCust = state.filters.customer;
                const fCompany = state.filters.company || 'all';
                const fStatus = state.filters.status;

                const checkDate = (timestamp) => {
                    if(!timestamp) return false;
                    const d = timestamp.seconds ? new Date(timestamp.seconds*1000) : new Date(timestamp);
                    if(fYear !== 'all' && d.getFullYear() != fYear) return false;
                    if(fMonth !== 'all' && d.getMonth() != fMonth) return false;
                    return true;
                };

                const filtered = allData.filter(item => {
                    const dateField = item.date || item.createdAt;
                    if (!checkDate(dateField)) return false;

                    if (state.activeTab === 'salary') {
                        if (fCompany !== 'all' && item.company !== fCompany) return false;
                    } else {
                        if (state.activeTab !== 'expense' && fCust !== 'all') {
                            if (item.clientName !== fCust) return false;
                        }
                    }

                    // Status Filter Logic for Invoices
                    if (state.activeTab === 'invoice' && fStatus !== 'all') {
                        if (item.status !== fStatus) {
                            if (fStatus === 'pending' && item.status !== 'pending') return false;
                            if (fStatus === 'paid' && item.status !== 'paid') return false;
                            if (fStatus === 'partial' && item.status !== 'partial') return false;
                            if (fStatus === 'refunded' && item.status !== 'refunded') return false;
                            if (item.status !== fStatus) return false;
                        }
                    }

                    return true;
                });

                app.renderList(filtered, state.activeTab);
            },

            renderList: (data, type) => {
                const container = document.getElementById('dashboard-content');
                if(!container) return;
                
                if(!data || data.length === 0) {
                    container.innerHTML = `<div class="p-8 text-center text-gray-400">No ${type}s found.</div>`;
                    return;
                }

                if (type === 'contract') {
                    container.innerHTML = `
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 border-b text-gray-600"><tr><th class="p-3">ID</th><th class="p-3">Title</th><th class="p-3">Client</th><th class="p-3">Date</th><th class="p-3 text-right">Actions</th></tr></thead>
                        <tbody class="divide-y">${data.map(c => `
                            <tr class="hover:bg-gray-50">
                                <td class="p-3 font-mono text-blue-600">${c.quotationNumber}</td>
                                <td class="p-3 font-medium">${c.title}</td><td class="p-3">${c.clientName}</td><td class="p-3">${new Date(c.createdAt?.seconds*1000).toLocaleDateString()}</td>
                                <td class="p-3 text-right">
                                    <button onclick="app.showVerify('${c.id}', 'contract')" class="text-gray-600 p-1 mr-2"><i data-lucide="printer" width="16"></i></button>
                                    <button onclick="app.duplicateDoc('${c.id}', 'contract')" class="text-green-600 p-1 mr-2"><i data-lucide="copy" width="16"></i></button>
                                    <button onclick="app.requireUnlockAndThen('editContract','${c.id}')" class="text-blue-600 p-1 mr-2"><i data-lucide="pencil" width="16"></i></button>
                                    <button onclick="app.requireUnlockAndThen('deleteDoc','${c.id}','contracts')" class="text-red-600 p-1"><i data-lucide="trash-2" width="16"></i></button>
                                </td>
                            </tr>`).join('')}</tbody>
                    </table>`;
                } else if (type === 'customer') {
                    container.innerHTML = `
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 border-b text-gray-600"><tr><th class="p-3">ID</th><th class="p-3">Name</th><th class="p-3">Phone</th><th class="p-3 text-right">Actions</th></tr></thead>
                        <tbody class="divide-y">${data.map(c => `
                            <tr class="hover:bg-gray-50">
                                <td class="p-3 font-mono text-gray-500">${c.customerId || '-'}</td>
                                <td class="p-3 font-medium">${c.name}</td><td class="p-3">${c.phone || '-'}</td>
                                <td class="p-3 text-right">
                                    <button onclick="app.requireUnlockAndThen('editCustomer','${c.id}')" class="text-blue-600 p-1"><i data-lucide="pencil" width="16"></i></button>
                                    <button onclick="app.requireUnlockAndThen('deleteDoc','${c.id}','customers')" class="text-red-600 p-1"><i data-lucide="trash-2" width="16"></i></button>
                                </td>
                            </tr>`).join('')}</tbody>
                    </table>`;
                } else if (type === 'expense') {
                    container.innerHTML = `
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 border-b text-gray-600"><tr><th class="p-3">Date</th><th class="p-3">Desc</th><th class="p-3">Category</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">Actions</th></tr></thead>
                        <tbody class="divide-y">${data.map(e => `
                            <tr class="hover:bg-gray-50">
                                <td class="p-3">${new Date(e.date).toLocaleDateString()}</td><td class="p-3 font-medium">${e.title}</td><td class="p-3"><span class="bg-gray-100 text-xs px-2 py-1 rounded">${e.category||'-'}</span></td><td class="p-3 text-right font-medium text-red-600">-${Number(e.amount).toLocaleString()}</td>
                                <td class="p-3 text-right">
                                    <button onclick="app.duplicateDoc('${e.id}', 'expense')" class="text-green-600 p-1"><i data-lucide="copy" width="16"></i></button>
                                    <button onclick="app.requireUnlockAndThen('deleteDoc','${e.id}','expenses')" class="text-red-600 p-1"><i data-lucide="trash-2" width="16"></i></button>
                                </td>
                            </tr>`).join('')}</tbody>
                    </table>`;
                } else if (type === 'adjustment') {
                    container.innerHTML = `
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 border-b text-gray-600"><tr><th class="p-3">Date</th><th class="p-3">Desc</th><th class="p-3">Method</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">Actions</th></tr></thead>
                        <tbody class="divide-y">${data.map(a => `
                            <tr class="hover:bg-gray-50">
                                <td class="p-3">${new Date(a.date).toLocaleDateString()}</td>
                                <td class="p-3 font-medium">${a.title}</td>
                                <td class="p-3"><span class="bg-gray-100 text-xs px-2 py-1 rounded">${a.method||'-'}</span></td>
                                <td class="p-3 text-right font-medium ${a.sign==='+'?'text-green-700':'text-red-600'}">${a.sign==='+' ? ('+' + Number(a.amount).toLocaleString()) : ('-' + Number(a.amount).toLocaleString())}</td>
                                <td class="p-3 text-right">
                                    <button onclick="app.duplicateDoc('${a.id}', 'adjustment')" class="text-green-600 p-1"><i data-lucide="copy" width="16"></i></button>
                                    <button onclick="app.requireUnlockAndThen('deleteDoc','${a.id}','adjustments')" class="text-red-600 p-1"><i data-lucide="trash-2" width="16"></i></button>
                                </td>
                            </tr>`).join('')}</tbody>
                    </table>`;
                } else {
                    // Invoice & Quotation
                    container.innerHTML = `
                    <table class="w-full text-left text-sm">
                         <thead class="bg-gray-50 border-b text-gray-600"><tr><th class="p-3">ID</th><th class="p-3">Client</th><th class="p-3 text-right">Amount</th><th class="p-3 text-center">Status</th><th class="p-3 text-right">Actions</th></tr></thead>
                         <tbody class="divide-y">${data.map(item => {
                             const isPaid = item.status === 'paid';
                             const isPartial = item.status === 'partial';
                             const isRefunded = item.status === 'refunded';
                             
                             let badge = type==='quotation' ? '<span class="px-2 py-0.5 rounded text-xs bg-gray-100">QTN</span>' : (
                                 isRefunded ? '<span class="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">REFUNDED</span>' :
                                 (isPaid ? '<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">PAID</span>' : (isPartial ? '<span class="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">PARTIAL</span>' : '<span class="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">PENDING</span>'))
                             );
                             
                             let paid = item.payments ? item.payments.reduce((s,p)=>s+p.amount,0) : 0;
                             let bal = item.totalAmount - paid;
                             
                             let actionBtns = `
                                <div class="flex items-center justify-end gap-1">
                                    <button onclick="app.showVerify('${item.id}', '${type}')" class="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200" title="Print/View"><i data-lucide="printer" width="14"></i></button>
                             `;
                             
                             if(type==='invoice') {
                                if(!isRefunded) actionBtns += `<button onclick="app.handleStatusClick('${item.id}')" class="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Payment"><i data-lucide="credit-card" width="14"></i></button>`;
                                if(!isRefunded) actionBtns += `<button onclick="app.markRefund('${item.id}')" class="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Refund"><i data-lucide="rotate-ccw" width="14"></i></button>`;
                             } else {
                                actionBtns += `<button onclick="app.convertQuotation('${item.id}')" class="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100" title="Convert"><i data-lucide="arrow-right-circle" width="14"></i></button>`;
                             }
                             
                             actionBtns += `
                                    <button onclick="app.duplicateDoc('${item.id}', '${type}')" class="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Copy"><i data-lucide="copy" width="14"></i></button>
                                    <button onclick="app.requireUnlockAndThen('editDoc','${item.id}','${type}')" class="p-1.5 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100" title="Edit"><i data-lucide="pencil" width="14"></i></button>
                                    <button onclick="app.requireUnlockAndThen('deleteDoc','${item.id}','${type}s')" class="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Delete"><i data-lucide="trash-2" width="14"></i></button>
                                </div>
                             `;

                             return `<tr class="hover:bg-gray-50 border-b">
                                <td class="p-3 font-medium text-blue-600">${item.invoiceNumber || item.quotationNumber}</td>
                                <td class="p-3">${item.clientName}</td>
                                <td class="p-3 text-right"><div>${Number(item.totalAmount).toLocaleString()}</div>${type==='invoice' && bal>0 && !isRefunded ? `<div class="text-xs text-red-500">Bal: ${bal.toLocaleString()}</div>` : ''}</td>
                                <td class="p-3 text-center">${badge}</td>
                                <td class="p-3 text-right">${actionBtns}</td>
                             </tr>`;
                          }).join('')}</tbody>
                    </table>`;
                }
                lucide.createIcons();
            },

            renderSalaryList: () => {
                const container = document.getElementById('dashboard-content');
                if(!container) return;
                const data = state.salaryIncomes || [];
                if(data.length === 0) { container.innerHTML = `<div class="p-8 text-center text-gray-400">No salary entries.</div>`; return; }
                container.innerHTML = `
                    <div class="p-4 bg-white rounded-lg shadow">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-bold">Salary Entries</h3>
                            <button onclick="document.getElementById('salary-manage-modal')?.remove(); app.openSalaryModal()" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Salary</button>
                        </div>
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-50 border-b text-gray-600"><tr><th class="p-3">Date</th><th class="p-3">Title</th><th class="p-3">Company</th><th class="p-3">Method</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">Actions</th></tr></thead>
                            <tbody class="divide-y">${data.map(s => `
                                <tr class="hover:bg-gray-50">
                                    <td class="p-3">${s.date ? new Date(s.date).toLocaleDateString() : '-'}</td>
                                    <td class="p-3 font-medium">${s.source||'-'}</td>
                                    <td class="p-3">${s.company||'-'}</td>
                                    <td class="p-3">${s.method||'-'}</td>
                                    <td class="p-3 text-right font-medium">${Number(s.amount||0).toLocaleString()}</td>
                                    <td class="p-3 text-right"><button onclick="app.requireUnlockAndThen('deleteDoc','${s.id||''}','salary_incomes')" class="text-red-600">Delete</button></td>
                                </tr>
                            `).join('')}</tbody>
                        </table>
                    </div>
                `;
                lucide.createIcons();
            },

            // --- Handlers & Actions ---
            duplicateDoc: (id, type) => {
                if(!confirm("Duplicate this record?")) return;
                
                if (type === 'expense') {
                    const e = state.expenses.find(x => x.id === id);
                    if(e) {
                        const newData = {...e, date: new Date().toISOString().split('T')[0], createdAt: serverTimestamp()};
                        delete newData.id;
                        addDoc(collection(db, 'expenses'), newData);
                    }
                    return;
                }
                if (type === 'adjustments' || type === 'adjustment') {
                    const a = state.adjustments.find(x => x.id === id);
                    if(a) {
                        const newData = {...a, date: new Date().toISOString().split('T')[0], createdAt: serverTimestamp()};
                        delete newData.id;
                        addDoc(collection(db, 'adjustments'), newData);
                    }
                    return;
                }
                if (type === 'adjustment') {
                    const a = state.adjustments.find(x => x.id === id);
                    if(a) {
                        const newData = {...a, date: new Date().toISOString().split('T')[0], createdAt: serverTimestamp()};
                        delete newData.id;
                        addDoc(collection(db, 'adjustments'), newData);
                    }
                    return;
                }

                // For Inv/Quote/Contract
                const coll = type + 's';
                const docData = state[coll].find(x => x.id === id);
                if (!docData) return;

                const newData = JSON.parse(JSON.stringify(docData));
                delete newData.id;
                newData.createdAt = serverTimestamp();
                newData.securityCode = (type==='contract'?'CON-':(type==='invoice'?'SEC-':'QTN-')) + Math.random().toString(36).substring(2,8).toUpperCase();
                
                // Generate new ID based on type
                const rnd = Date.now().toString().slice(-6);
                if (type === 'invoice') {
                    newData.invoiceNumber = 'INV-' + rnd;
                    newData.status = 'pending';
                    newData.payments = [];
                    newData.paidAt = null;
                    if(newData.source) newData.source = 'manual'; // Reset source on duplicate
                } else if (type === 'quotation') {
                    newData.quotationNumber = 'QTN-' + rnd;
                } else if (type === 'contract') {
                    newData.quotationNumber = 'CON-' + rnd;
                }

                state.mode = type;
                state.editingId = null; // Create Mode
                
                // Pre-fill form state
                if (type === 'contract') {
                    // Contracts handled differently
                    // We just save it directly for simplicity or open editor?
                    // Let's open editor with data
                    app.setView('contract-edit');
                    setTimeout(() => {
                        document.getElementById('contract-title').value = newData.title + " (Copy)";
                        document.getElementById('contract-doc-number').value = newData.quotationNumber;
                        document.getElementById('contract-client').value = newData.clientName;
                        app.fillCustomerInfo(newData.clientName);
                        document.getElementById('contract-editor').innerHTML = newData.content;
                    }, 200);
                } else {
                    state.items = newData.items;
                    state.discount = newData.discount;
                    state.taxRate = newData.taxRate;
                    app.setView('create');
                    setTimeout(() => {
                        document.getElementById('client-name').value = newData.clientName;
                        document.getElementById('doc-number').value = newData.invoiceNumber || newData.quotationNumber;
                        document.getElementById('doc-note').value = newData.note || '';
                        app.fillCustomerInfo(newData.clientName);
                        app.calcTotal();
                    }, 200);
                }
            },

            markRefund: async (id) => {
                if(!confirm(app.t('refund_confirm'))) return;
                app.requireUnlockAndThen('markRefundConfirmed', id);
            },
            markRefundConfirmed: async (id) => {
                try { await updateDoc(doc(db, 'invoices', id), { status: 'refunded', refundedAt: serverTimestamp() }); } catch(e) { console.error(e); alert('Failed to mark refund.'); }
            },

            handleCreateButtonClick: () => {
                const tab = state.activeTab;
                if(tab === 'invoice') app.showInvoiceOptionModal();
                else if(tab === 'quotation') app.createMode('quotation');
                else if(tab === 'contract') { state.editingId = null; app.setView('contract-edit'); }
                else if(tab === 'customer') app.openCustomerModal();
                else if(tab === 'expense') app.openExpenseModal();
                else if(tab === 'adjustment') app.openAdjustmentModal();
            },

            openCustomerModal: (cust = null) => {
                const modal = document.getElementById('modal-container');
                const tpl = document.getElementById('tpl-customer-form');
                modal.innerHTML = ''; modal.appendChild(tpl.content.cloneNode(true));
                app.translatePage();
                
                if(!cust) {
                    document.getElementById('cust-display-id').value = 'CUST-' + Date.now().toString().slice(-6);
                }

                if(cust) {
                    document.getElementById('cust-form-title').innerText = 'Edit Customer';
                    document.getElementById('cust-id').value = cust.id;
                    document.getElementById('cust-display-id').value = cust.customerId || 'CUST-' + Date.now().toString().slice(-6);
                    document.getElementById('cust-name').value = cust.name;
                    document.getElementById('cust-phone').value = cust.phone;
                    document.getElementById('cust-email').value = cust.email || '';
                    document.getElementById('cust-address').value = cust.address;
                }
            },
            saveCustomer: async (e) => {
                e.preventDefault();
                const id = document.getElementById('cust-id').value;
                const data = {
                    customerId: document.getElementById('cust-display-id').value,
                    name: document.getElementById('cust-name').value,
                    phone: document.getElementById('cust-phone').value,
                    email: document.getElementById('cust-email').value,
                    address: document.getElementById('cust-address').value
                };
                if(id) await updateDoc(doc(db, 'customers', id), data);
                else await addDoc(collection(db, 'customers'), {...data, createdAt: serverTimestamp()});
                app.closeModal();
            },
            editCustomer: (id) => app.openCustomerModal(state.customers.find(c => c.id === id)),
            fillCustomerInfo: (val) => {
                const cust = state.customers.find(c => c.name === val || c.id === val);
                const details = document.getElementById('client-details');
                
                if(cust) {
                    if(document.getElementById('client-name')) document.getElementById('client-name').value = cust.name;
                    if(document.getElementById('contract-client')) document.getElementById('contract-client').value = cust.name;
                    
                    if(document.getElementById('client-db-id')) document.getElementById('client-db-id').value = cust.id;
                    
                    if(document.getElementById('client-id-input')) document.getElementById('client-id-input').value = cust.customerId || '';
                    if(document.getElementById('contract-client-id')) document.getElementById('contract-client-id').value = cust.customerId || '';

                    if(document.getElementById('client-phone')) document.getElementById('client-phone').innerText = cust.phone || '';
                    if(document.getElementById('client-address')) document.getElementById('client-address').innerText = cust.address || '';
                    
                    if(document.getElementById('client-email-hidden')) document.getElementById('client-email-hidden').value = cust.email || '';
                    if(document.getElementById('client-phone-hidden')) document.getElementById('client-phone-hidden').value = cust.phone || '';
                    if(document.getElementById('client-address-hidden')) document.getElementById('client-address-hidden').value = cust.address || '';

                    if(details) details.classList.remove('hidden');
                } else {
                    if(document.getElementById('client-db-id')) document.getElementById('client-db-id').value = '';
                    if(details) details.classList.add('hidden');
                }
            },
            
            fillCustomerById: (idVal) => {
                const cust = state.customers.find(c => c.customerId === idVal);
                if (cust) {
                    app.fillCustomerInfo(cust.name);
                }
            },

            openExpenseModal: () => {
                const modal = document.getElementById('modal-container');
                const tpl = document.getElementById('tpl-expense-form');
                modal.innerHTML = ''; modal.appendChild(tpl.content.cloneNode(true));
                app.translatePage();
                app.populatePaymentSelects(); 
                document.getElementById('exp-date').valueAsDate = new Date();

                // Populate Categories
                const catSelect = document.getElementById('exp-cat');
                const cats = state.settings.expense_categories || ['Other'];
                catSelect.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
            },
            saveExpense: async (e) => {
                e.preventDefault();
                const data = {
                    category: document.getElementById('exp-cat').value,
                    title: document.getElementById('exp-title').value,
                    amount: Number(document.getElementById('exp-amount').value),
                    method: document.getElementById('exp-method').value,
                    date: document.getElementById('exp-date').value,
                    createdAt: serverTimestamp()
                };
                await addDoc(collection(db, 'expenses'), data);
                app.closeModal();
            },

            openAdjustmentModal: () => {
                const modal = document.getElementById('modal-container');
                const tpl = document.getElementById('tpl-adjustment-form');
                modal.innerHTML = ''; modal.appendChild(tpl.content.cloneNode(true));
                app.translatePage();
                app.populatePaymentSelects();
                document.getElementById('adj-date').valueAsDate = new Date();
            },
            saveAdjustment: async (e) => {
                e.preventDefault();
                const sign = document.getElementById('adj-sign') ? document.getElementById('adj-sign').value : '-';
                const rawAmt = Number(document.getElementById('adj-amount').value || 0);
                const data = {
                    type: (sign === '+' ? 'refund' : 'adjustment'),
                    sign: sign,
                    title: document.getElementById('adj-title').value,
                    amount: rawAmt,
                    method: document.getElementById('adj-method').value,
                    date: document.getElementById('adj-date').value,
                    createdAt: serverTimestamp()
                };
                await addDoc(collection(db, 'adjustments'), data);
                app.closeModal();
            },

            initCreateForm: () => {
                const title = state.editingId ? `Edit ${state.mode}` : `New ${state.mode}`;
                document.getElementById('form-title').innerText = title;
                document.getElementById('form-mode-badge').innerText = state.mode;
                
                const dl = document.getElementById('customer-list');
                const dlIds = document.getElementById('customer-ids');
                dl.innerHTML = state.customers.map(c => `<option value="${c.name}">${c.phone || ''}</option>`).join('');
                dlIds.innerHTML = state.customers.map(c => `<option value="${c.customerId}">${c.name}</option>`).join('');

                const paySection = document.getElementById('invoice-payment-section');
                paySection.style.display = state.mode === 'quotation' ? 'none' : 'block';
                
                app.populatePaymentSelects(); 
                app.renderCreateItems();
                
                const docNumInput = document.getElementById('doc-number');
                if(!state.editingId) {
                    state.taxRate = state.settings.taxRate || 0;
                    document.getElementById('tax-input').value = state.taxRate;
                    if(document.getElementById('service-fee')) document.getElementById('service-fee').value = state.serviceFee || 0;
                    if(document.getElementById('service-desc')) document.getElementById('service-desc').value = state.serviceDesc || '';
                    docNumInput.value = (state.mode === 'invoice' ? 'INV-' : 'QTN-') + Date.now().toString().slice(-6);
                    app.calcTotal();
                }
            },

            handleSave: async (e) => {
                e.preventDefault();
                const clientName = document.getElementById('client-name').value;
                const clientId = document.getElementById('client-db-id').value; 
                const docNumber = document.getElementById('doc-number').value;
                const clientEmail = document.getElementById('client-email-hidden').value;
                const clientPhone = document.getElementById('client-phone-hidden').value;
                const clientAddress = document.getElementById('client-address-hidden').value;
                const note = document.getElementById('doc-note').value;

                const total = app.calcTotal();
                const col = state.mode + 's'; 
                try {
                    const docData = {
                        clientName, clientId, items: state.items, discount: state.discount, 
                            taxRate: state.taxRate, totalAmount: total, note,
                        clientEmail, clientPhone, clientAddress,
                        securityCode: state.editingId ? undefined : `SEC-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
                        createdBy: state.user.uid
                    };
                        // Include service fee and description when saving invoice/quotation
                        const feeEl = document.getElementById('service-fee');
                        if(feeEl) docData.serviceFee = Number(feeEl.value || state.serviceFee || 0);
                        const descEl = document.getElementById('service-desc');
                        if(descEl) docData.serviceDesc = descEl.value || state.serviceDesc || '';
                    
                    if(state.mode === 'invoice') {
                        docData.invoiceNumber = docNumber;
                        if (!state.editingId) {
                            docData.source = state.isConverted ? 'converted' : 'manual';
                        }
                    } else {
                        docData.quotationNumber = docNumber;
                    }

                    if(docData.securityCode === undefined) delete docData.securityCode;

                    if (state.mode === 'invoice') {
                        if (!state.editingId && state.initPayment > 0) {
                            const m = document.getElementById('init-payment-method').value;
                            docData.payments = [{ amount: state.initPayment, method: m, date: new Date().toISOString() }];
                            docData.status = state.initPayment >= total ? 'paid' : 'partial';
                            if(docData.status === 'paid') docData.paidAt = serverTimestamp();
                        } else if (!state.editingId) { docData.payments = []; docData.status = 'pending'; }
                    }

                    if (state.editingId) await updateDoc(doc(db, col, state.editingId), docData);
                    else {
                        docData.createdAt = serverTimestamp();
                        await addDoc(collection(db, col), docData);
                    }
                    state.activeTab = state.mode; app.setView('dashboard');
                } catch(e) { console.error(e); alert(e.message); }
            },

            createMode: (mode) => { state.mode = mode; state.editingId = null; state.items = [{desc:'', price:0, qty:1}]; state.discount = 0; state.taxRate = state.settings.taxRate || 0; state.initPayment = 0; state.serviceFee = 0; app.setView('create'); },
            createManualInvoice: () => { 
                app.closeModal(); 
                state.isConverted = false; 
                app.createMode('invoice'); 
            },
            showInvoiceOptionModal: () => { document.getElementById('modal-container').appendChild(document.getElementById('tpl-invoice-option').content.cloneNode(true)); app.translatePage(); lucide.createIcons(); },
            closeModal: () => document.getElementById('modal-container').innerHTML = '',
            
            editDoc: (id, type) => {
                const d = state[type + 's'].find(i => i.id === id);
                if(type === 'invoice' && d && d.status === 'paid') {
                    return app.requireUnlockAndThen('editDocUnlocked', id, type);
                }
                return app.editDocUnlocked(id, type);
            },
            editDocUnlocked: (id, type) => {
                state.mode = type; state.editingId = id;
                const d = state[type + 's'].find(i => i.id === id);
                state.items = JSON.parse(JSON.stringify(d.items)); state.discount = d.discount || 0; state.taxRate = d.taxRate || 0;
                app.setView('create');
                setTimeout(() => { 
                    document.getElementById('client-name').value = d.clientName; 
                    document.getElementById('discount-input').value = state.discount; 
                    document.getElementById('tax-input').value = state.taxRate;
                    document.getElementById('doc-number').value = d.invoiceNumber || d.quotationNumber;
                    document.getElementById('doc-note').value = d.note || '';
                    
                    app.fillCustomerInfo(d.clientName); 

                    // Populate service fee and description if present on document
                    if(document.getElementById('service-fee')) document.getElementById('service-fee').value = d.serviceFee || 0;
                    if(document.getElementById('service-desc')) document.getElementById('service-desc').value = d.serviceDesc || '';

                    if(type==='invoice'){ document.getElementById('init-payment-input').disabled = true; }
                    app.calcTotal();
                }, 100);
            },
            editContract: (id) => { 
                state.editingId = id; 
                app.setView('contract-edit'); 
            },
            deleteDoc: async (id, coll) => {
                if(!confirm("Delete?")) return;
                try { await deleteDoc(doc(db, coll, id)); } catch(e) { console.error(e); alert('Failed to delete.'); }
            },
            
            convertQuotation: (id) => {
                const q = state.quotations.find(i => i.id === id);
                if(!q || !confirm("Convert to Invoice?")) return;
                state.mode = 'invoice'; state.editingId = null; state.items = JSON.parse(JSON.stringify(q.items)); state.discount = q.discount || 0; state.taxRate = q.taxRate || 0; state.initPayment = 0;
                
                state.isConverted = true; 

                app.setView('create');
                setTimeout(() => { 
                    document.getElementById('client-name').value = q.clientName; 
                    document.getElementById('discount-input').value = state.discount; 
                    document.getElementById('tax-input').value = state.taxRate;
                    document.getElementById('doc-number').value = 'INV-' + Date.now().toString().slice(-6); 
                    
                    // PREFILL NOTE
                    document.getElementById('doc-note').value = `Ref: ${q.quotationNumber}`;

                    app.fillCustomerInfo(q.clientName);
                    app.calcTotal();
                }, 100);
            },
            importQuotation: async () => {
                const val = document.getElementById('qtn-import-input').value.trim().toUpperCase();
                const snap = await getDocs(query(collection(db, 'quotations'), where("quotationNumber", "==", val)));
                if(snap.empty) return alert("Not Found");
                const q = snap.docs[0].data();
                app.closeModal(); state.mode = 'invoice'; state.editingId = null; state.items = q.items; state.discount = q.discount || 0; state.taxRate = q.taxRate || 0; state.initPayment = 0;
                
                state.isConverted = true; 

                app.setView('create'); 
                setTimeout(() => { 
                    document.getElementById('client-name').value = q.clientName; 
                    document.getElementById('discount-input').value = state.discount; 
                    document.getElementById('tax-input').value = state.taxRate;
                    document.getElementById('doc-number').value = 'INV-' + Date.now().toString().slice(-6);
                    document.getElementById('doc-note').value = `Ref: ${q.quotationNumber}`;
                    app.fillCustomerInfo(q.clientName);
                    app.calcTotal();
                }, 100);
            },

            renderCreateItems: () => {
                const c = document.getElementById('items-container'); c.innerHTML = `<label class="block text-sm font-medium mb-2">${app.t('items')}</label>`;
                state.items.forEach((item, i) => {
                    const div = document.createElement('div'); div.className = "flex gap-2 mb-2 items-start";
                    div.innerHTML = `<span class="pt-2 text-sm font-bold text-gray-500 w-6">${i+1}.</span><input placeholder="${app.t('desc')}" class="flex-grow border p-2 rounded w-1/3" onchange="app.updateItem(${i}, 'desc', this.value)" value="${item.desc}"><input type="number" placeholder="${app.t('qty')}" class="w-16 border p-2 rounded" onchange="app.updateItem(${i}, 'qty', this.value)" value="${item.qty}"><input type="number" placeholder="${app.t('price')}" class="w-24 border p-2 rounded" onchange="app.updateItem(${i}, 'price', this.value)" value="${item.price}"><button type="button" onclick="app.triggerImageUpload(${i})" class="p-2 border rounded"><i data-lucide="camera" width="16"></i></button><button type="button" onclick="app.removeItem(${i})" class="text-red-500 p-2"><i data-lucide="x-circle" width="16"></i></button>`;
                    c.appendChild(div);
                });
                lucide.createIcons(); app.calcTotal();
            },
            updateItem: (i, f, v) => { state.items[i][f] = f==='desc'?v:Number(v); app.calcTotal(); },
            addItem: () => { state.items.push({desc:'',price:0,qty:1}); app.renderCreateItems(); },
            removeItem: (i) => { state.items.splice(i,1); app.renderCreateItems(); },
            updateCalc: (v, t) => { 
                if(t==='discount') state.discount=Number(v); 
                if(t==='tax') state.taxRate=Number(v);
                if(t==='payment') state.initPayment=Number(v); 
                if(t==='service') state.serviceFee=Number(v);
                app.calcTotal(); 
            },
            calcTotal: () => {
                const sub = state.items.reduce((s,i)=>s+(i.price*i.qty),0); 
                const taxAmt = sub * (state.taxRate / 100);
                const tot = sub - state.discount + taxAmt + (state.serviceFee || 0);
                
                document.getElementById('subtotal-display').innerText = sub.toLocaleString();
                document.getElementById('create-total').innerText = tot.toLocaleString();
                if(document.getElementById('create-balance')) document.getElementById('create-balance').innerText = (tot - state.initPayment).toLocaleString();
                return tot;
            },
            triggerImageUpload: (i) => { state.uploadingRowIndex = i; document.getElementById('item-image-input').click(); },
            processItemImage: (input) => { app.processImageBase(input, (url) => { state.items[state.uploadingRowIndex].image = url; alert("Image Added"); }); },

            handleAuthClick: () => state.isAdmin ? app.setView('dashboard') : app.setView('login'),
            handleEmailAuth: async (e) => { e.preventDefault(); try { await signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value); app.setView('dashboard'); } catch(e){ document.getElementById('auth-error').innerText=e.message; document.getElementById('auth-error').classList.remove('hidden'); } },
            googleLogin: async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); app.setView('dashboard'); } catch(e){alert(e.message);} },
            logout: async () => { await signOut(auth); state.isAdmin = false; app.setView('home'); try{await signInAnonymously(auth);}catch(e){} },
            
            fillSettingsForm: () => {
                if(state.settings.logo) document.getElementById('logo-preview').innerHTML = `<img src="${state.settings.logo}" class="h-full object-contain">`;
                if(state.settings.authSign) document.getElementById('sign-preview').innerHTML = `<img src="${state.settings.authSign}" class="h-full object-contain">`;
                document.getElementById('setting-accounts').value = state.settings.accounts || '';
                document.getElementById('setting-terms').value = state.settings.terms || '';
                document.getElementById('setting-auth-name').value = state.settings.authName || '';
                
                document.getElementById('setting-biz-name').value = state.settings.bizName || '';
                document.getElementById('setting-biz-address').value = state.settings.bizAddress || '';
                document.getElementById('setting-biz-phone').value = state.settings.bizPhone || '';
                document.getElementById('setting-biz-web').value = state.settings.bizWeb || '';
                document.getElementById('setting-biz-email').value = state.settings.bizEmail || '';
                document.getElementById('setting-tax').value = state.settings.taxRate || 0;
            },
            handleSaveSettings: async (e) => {
                e.preventDefault();
                state.settings.accounts = document.getElementById('setting-accounts').value;
                state.settings.terms = document.getElementById('setting-terms').value;
                state.settings.authName = document.getElementById('setting-auth-name').value;
                
                state.settings.bizName = document.getElementById('setting-biz-name').value;
                state.settings.bizAddress = document.getElementById('setting-biz-address').value;
                state.settings.bizPhone = document.getElementById('setting-biz-phone').value;
                state.settings.bizWeb = document.getElementById('setting-biz-web').value;
                state.settings.bizEmail = document.getElementById('setting-biz-email').value;
                state.settings.taxRate = Number(document.getElementById('setting-tax').value);

                await setDoc(doc(db, 'invoices', 'config_general'), state.settings);
                alert("Saved"); app.setView('dashboard');
            },
            requireUnlockAndThen: (fnName, ...args) => {
                const pw = prompt('Enter PIN code to proceed:');
                if (!pw) {
                    alert('PIN code is required.');
                    return;
                }
                
                // Check against the default PIN
                if (pw === DEFAULT_PIN) {
                    if (typeof app[fnName] === 'function') {
                        try { app[fnName](...args); } catch(e) { console.error(e); }
                    } else {
                        alert('Action not available');
                    }
                } else {
                    alert('Incorrect PIN code');
                }
            },
            processImageBase: (input, cb) => {
                if(!input.files[0]) return;
                const r = new FileReader(); r.onload = (e) => { const i = new Image(); i.onload = () => { const c = document.createElement('canvas'); const s = 300/i.width; c.width=300; c.height=i.height*s; c.getContext('2d').drawImage(i,0,0,c.width,c.height); cb(c.toDataURL('image/png')); input.value=''; }; i.src=e.target.result; }; r.readAsDataURL(input.files[0]);
            },
            processLogo: (i) => app.processImageBase(i, (u) => { state.settings.logo = u; document.getElementById('logo-preview').innerHTML = `<img src="${u}" class="h-full">`; }),
            processSign: (i) => app.processImageBase(i, (u) => { state.settings.authSign = u; document.getElementById('sign-preview').innerHTML = `<img src="${u}" class="h-full">`; }),

            handleSearch: async (v) => {
                const q = (v || document.getElementById('search-input').value).trim();
                if(!q) return;
                app.setView('verify');
                const search = async (c, f) => { const s = await getDocs(query(collection(db,c), where(f,"==",q))); return !s.empty ? {id:s.docs[0].id, ...s.docs[0].data(), type:c.slice(0,-1)} : null; };
                let f = await search('invoices','invoiceNumber') || await search('quotations','quotationNumber') || await search('contracts','quotationNumber') || await search('invoices','securityCode') || await search('quotations','securityCode') || await search('contracts','securityCode');
                if(f) app.renderPaper(f, f.type);
                else document.getElementById('verify-content').innerHTML = '<div class="p-10 text-center text-red-500 font-bold">Not Found</div>';
            },
            renderPaper: (d, t) => {
                state.currentDoc = d;
                const codeToEncode = d.securityCode || d.invoiceNumber || d.quotationNumber || 'N/A';
                const fullUrl = window.location.origin + window.location.pathname + '?code=' + codeToEncode;
                const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullUrl)}`;
                
                const logo = state.settings.logo ? `<img src="${state.settings.logo}" class="h-24 w-auto object-contain">` : '';
                const sign = state.settings.authSign ? `<img src="${state.settings.authSign}" class="h-16 mx-auto">` : '';
                
                const bizInfo = `
                    <div class="text-xs text-gray-500 mt-1 leading-none space-y-0">
                        ${state.settings.bizAddress ? `<div class="mb-0.5">${state.settings.bizAddress}</div>` : ''}
                        ${state.settings.bizPhone ? `<div class="mb-0.5">${state.settings.bizPhone}</div>` : ''}
                        ${state.settings.bizEmail ? `<div class="mb-0.5">${state.settings.bizEmail}</div>` : ''}
                        ${state.settings.bizWeb ? `<div class="mb-0.5">${state.settings.bizWeb}</div>` : ''}
                    </div>
                `;

                if (t === 'contract') {
                    document.getElementById('verify-content').innerHTML = `
                    <div id="contract-paper" class="a4-paper">
                         <div>
                             <div class="flex justify-between items-start mb-8 border-b pb-6">
                                <div class="flex flex-col items-start">
                                    ${logo}
                                    <div class="mt-3">${bizInfo}</div>
                                </div>
                                <div class="text-right">
                                    <div class="mb-4">
                                        <span class="block text-xs text-gray-500 uppercase">Contract No.</span>
                                        <span class="block font-bold text-xl text-blue-900">${d.quotationNumber}</span>
                                        <span class="text-sm text-gray-500">Date: ${new Date(d.createdAt?.seconds*1000).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <h5 class="text-right font-bold text-gray-600 uppercase text-xs mb-1 ">Contract With:</h5>
                                        <h3 class="text-right font-bold text-gray-600 uppercase text-xs mb-1 ">${d.clientName}</h3>
                                        <div class="text-sm text-gray-500 leading-tight">
                                       
                                            ${d.clientPhone ? `<div>${d.clientPhone}</div>` : ''}
                                            ${d.clientEmail ? `<div>${d.clientEmail}</div>` : ''}
                                            ${d.clientAddress ? `<div>${d.clientAddress}</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div class="prose max-w-none mb-12">
                                 ${d.content}
                             </div>
                         </div>
                         <div class="mt-8 pt-4 border-t-2 border-gray-100">
                             <div class="flex justify-between items-end">
                                 <div class="text-center w-48 leading-tight">
                                    <div class="border-b border-gray-800 mb-1 pb-4"></div>
                                    <p class="font-bold text-sm m-0">${d.signerBusiness || d.clientName || 'Client'}</p>
                                    <p class="text-xs m-0">${d.signerName || ''}</p>
                                    <p class="text-[10px] text-gray-500 m-0">${d.signerPosition || 'Authorized Signature'}</p>
                                 </div>
                                 <div class="text-center w-48 leading-tight">
                                    <div class="h-16 flex items-end justify-center">${sign}</div>
                                    <div class="border-b border-gray-800 mb-1"></div>
                                    <p class="font-bold text-sm m-0">${state.settings.bizName || 'Service Provider'}</p>
                                    <p class="text-xs m-0">${state.settings.authName || ''}</p>
                                    <p class="text-[10px] text-gray-500 m-0">Authorized Signature</p>
                                 </div>
                                 <div>
                                    <img src="${qr}" class="w-16">
                                 </div>
                             </div>
                         </div>
                    </div>`;
                    lucide.createIcons();
                    app.scalePaper(); 
                    return;
                }

                // Invoice/Quotation Render
                document.getElementById('verify-content').innerHTML = `
                <div id="invoice-paper" class="a4-paper">
                    <div>
                        <div class="flex justify-between border-b pb-6 mb-6">
                            <div>
                                <h1 class="text-3xl font-bold text-blue-900 uppercase">${t}</h1>
                                <p class="font-bold text-lg">#${d.invoiceNumber||d.quotationNumber}</p>
                                ${bizInfo}
                            </div>
                            <div class="text-right">${logo}</div>
                        </div>
                        <div class="flex justify-between mb-8">
                            <div>
                                <h3 class="font-bold text-gray-600 uppercase text-xs mb-1">${app.t('bill_to')}</h3>
                                <p class="font-bold text-lg mb-1">${d.clientName}</p>
                                <div class="text-sm text-gray-500 leading-tight">
                                    ${d.clientAddress ? `<div class="mb-0.5">${d.clientAddress}</div>` : ''}
                                    ${d.clientPhone ? `<div class="mb-0.5">${d.clientPhone}</div>` : ''}
                                    ${d.clientEmail ? `<div class="mb-0.5">${d.clientEmail}</div>` : ''}
                                </div>
                            </div>
                            <div class="text-right">
                                <h3 class="font-bold">${app.t('date')}</h3><p>${new Date(d.createdAt?.seconds*1000||Date.now()).toLocaleDateString()}</p>
                                ${t==='invoice' && d.status==='refunded' ? '<div class="text-red-600 font-bold border-2 border-red-600 inline-block px-2 mt-2">REFUNDED</div>' : 
                                  (t==='invoice'&&d.status==='paid'?'<div class="text-green-700 font-bold border-2 border-green-700 inline-block px-2 mt-2">PAID</div>':'')
                                }
                                ${t==='invoice'&&d.payments?.length?`<div class="mt-4 text-xs text-gray-500 text-right"><p class="font-bold mb-1 underline">${app.t('payment_history')}</p><table class="w-full text-right ml-auto" style="width: auto;">${d.payments.map(p=>`<tr><td class="pr-2">${new Date(p.date).toLocaleDateString()}</td><td class="pr-2">(${p.method})</td><td class="font-bold">${p.amount.toLocaleString()}</td></tr>`).join('')}</table></div>`:''}
                            </div>
                        </div>
                        
                        ${d.note ? `<div class="mb-4 p-2 bg-gray-50 text-sm border-l-4 border-gray-300 italic">${d.note}</div>` : ''}

                        <table class="w-full mb-6 text-sm invoice-table">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="p-2 text-left">${app.t('no')}</th>
                                    <th class="p-2 text-left">${app.t('desc')}</th>
                                    <th class="p-2 text-right">${app.t('qty')}</th>
                                    <th class="p-2 text-right">${app.t('price')}</th>
                                    <th class="p-2 text-right">${app.t('total')}</th>
                                </tr>
                            </thead>
                            <tbody>${d.items.map((i, index)=>`
                                <tr>
                                    <td class="p-2 text-gray-500">${index + 1}</td>
                                    <td class="p-2"><div>${i.desc}</div>${i.image ? `<img src="${i.image}" class="mt-2 h-16 w-auto object-cover border rounded">` : ''}</td>
                                    <td class="p-2 text-right">${i.qty}</td>
                                    <td class="p-2 text-right">${i.price.toLocaleString()}</td>
                                    <td class="p-2 text-right">${(i.price*i.qty).toLocaleString()}</td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="mt-auto">
                        <div class="flex justify-between items-start border-t pt-4">
                            <div class="w-1/2 text-sm">
                                <p class="font-bold">${app.t('payment_info')}</p><pre class="font-sans text-xs whitespace-pre-line">${state.settings.accounts||''}</pre>
                                <div class="mt-4"><p class="font-bold">${app.t('terms_conditions')}</p><p class="whitespace-pre-line text-xs text-gray-600">${state.settings.terms||'-'}</p></div>
                                <div class="mt-4"><img src="${qr}" class="w-20 border p-1"></div>
                            </div>
                            <div class="w-1/3 text-right">
                                <div class="flex justify-between"><span>${app.t('subtotal')}</span><span>${d.items.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString()}</span></div>
                                ${d.discount?`<div class="flex justify-between text-red-500"><span>${app.t('discount')}</span><span>-${d.discount.toLocaleString()}</span></div>`:''}
                                ${d.taxRate?`<div class="flex justify-between text-gray-600"><span>Tax (${d.taxRate}%)</span><span>+${(d.items.reduce((s,i)=>s+i.price*i.qty,0) * (d.taxRate/100)).toLocaleString()}</span></div>`:''}
                                <div class="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span>${app.t('total')}</span><span>${d.totalAmount.toLocaleString()}</span></div>
                                
                                <div class="mt-10 text-center w-48 ml-auto">
                                    ${sign}
                                    <p class="text-xs font-bold uppercase mt-1">${state.settings.authName||''}</p>
                                    <div class="border-b border-gray-800 mt-1 mb-1"></div>
                                    <p class="text-[10px] text-gray-500">${app.t('authorized_signature')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 text-center text-[10px] text-gray-400 border-t pt-2">
                            ${app.t('system_generated')}
                        </div>
                    </div>
                </div>`;
                lucide.createIcons();
                app.scalePaper();
            },
            
            downloadPLCSV: () => {
                const d = state.reportPLData || {};
                const rows = [];
                rows.push(['Item','Value']);
                rows.push(['Total Income', d.totalIncome || 0]);
                rows.push(['Total Expense', d.totalExpense || 0]);
                rows.push(['Adjustments In', d.adjInTotal || 0]);
                rows.push(['Adjustments Out', d.adjOutTotal || 0]);
                rows.push(['Net Profit', d.netProfit || 0]);
                rows.push(['Receivable', d.totalReceivable || 0]);
                rows.push(['Refunds', d.totalRefunds || 0]);
                rows.push([]);
                rows.push(['Payment Method','In','Out']);
                const pms = d.paymentMethodSums || {};
                Object.keys(pms).forEach(k => rows.push([k, pms[k].in || 0, pms[k].out || 0]));

                const csv = rows.map(r => r.map(c => typeof c === 'number' ? c : `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `profit_and_loss_${d.year || 'all'}_${d.month || 'all'}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            },
            downloadPDF: async () => {
                const element = document.getElementById('invoice-paper') || document.getElementById('contract-paper');
                const oldTransform = element.style.transform;
                element.style.transform = 'none';
                
                const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                
                element.style.transform = oldTransform;

                const imgData = canvas.toDataURL('image/png');

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const margin = 0; 
                const pdfWidth = 210;
                const contentWidth = pdfWidth; 
                const contentHeight = (canvas.height * contentWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, contentWidth, contentHeight);
                const name = state.currentDoc ? (state.currentDoc.invoiceNumber || state.currentDoc.quotationNumber || 'Document') : 'Document';
                pdf.save(`${name}.pdf`);
            },
            backHome: () => app.setView(state.isAdmin ? 'dashboard' : 'home'),
            
            startScanner: () => {
                document.getElementById('scanner-modal').classList.remove('hidden');
                state.html5QrCode = new Html5Qrcode("reader");
                state.html5QrCode.start({facingMode:"environment"}, {fps:10, qrbox:250}, (t)=>{ app.stopScanner(); if(t.includes('code=')) app.handleSearch(new URL(t).searchParams.get('code')); else app.handleSearch(t); }).catch(()=>{});
            },
            stopScanner: () => { if(state.html5QrCode) state.html5QrCode.stop().then(()=>document.getElementById('scanner-modal').classList.add('hidden')); else document.getElementById('scanner-modal').classList.add('hidden'); },
            handleStatusClick: (id) => {
                const i = state.invoices.find(x=>x.id===id);
                if(i.status==='paid'){ return app.requireUnlockAndThen('unlockSetInvoicePending', id); }
                const paid = i.payments?i.payments.reduce((s,p)=>s+p.amount,0):0;
                state.tempInvoice = {...i, paid, balance: i.totalAmount-paid};
                const m = document.getElementById('tpl-payment-modal').content.cloneNode(true);
                document.getElementById('modal-container').innerHTML = ''; document.getElementById('modal-container').appendChild(m);
                app.translatePage(); 
                app.populatePaymentSelects(); 
                document.getElementById('modal-total').innerText = i.totalAmount.toLocaleString();
                document.getElementById('modal-paid').innerText = paid.toLocaleString();
                document.getElementById('modal-balance').innerText = state.tempInvoice.balance.toLocaleString();
                document.getElementById('payment-amount').value = state.tempInvoice.balance;
            },
            unlockSetInvoicePending: async (id) => {
                try { return updateDoc(doc(db,'invoices',id),{status:'pending',payments:[]}); } catch(e) { console.error(e); alert('Failed to unlock invoice.'); }
            },
            confirmPayment: async () => {
                const amt = Number(document.getElementById('payment-amount').value);
                const met = document.getElementById('payment-method-select').value;
                const inv = state.tempInvoice;
                const pays = [...(inv.payments||[]), {amount:amt, method:met, date:new Date().toISOString()}];
                const stat = pays.reduce((s,p)=>s+p.amount,0) >= inv.totalAmount ? 'paid' : 'partial';
                await updateDoc(doc(db,'invoices',inv.id), {status:stat, payments:pays, paidAt: stat==='paid'?serverTimestamp():null});
                app.closeModal();
            },

            // --- Reports Logic (Updated with Charts & Pivots) ---
            initReportFilters: () => {
                // populate year/customer selects used in reports
                const ysel = document.getElementById('filter-year');
                if(ysel){ const yearNow = new Date().getFullYear(); ysel.innerHTML = '<option value="all">All Years</option>'; for(let y=yearNow; y>=yearNow-5; y--){ ysel.innerHTML += `<option value="${y}">${y}</option>`; } }
                const cust = document.getElementById('filter-customer'); if(cust){ cust.innerHTML = '<option value="all">All Customers</option>'; (state.customers||[]).forEach(c=> cust.innerHTML += `<option value="${c.name}">${c.name}</option>`); }
            },

            openIncomePanel: (tab='invoice') => {
                app.closeIncomePanel();
                const modal = document.createElement('div');
                modal.id = 'income-panel';
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4';
                modal.innerHTML = `
                    <div class="bg-white w-full max-w-3xl rounded-xl p-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-lg">Income Breakdown</h3>
                            <div class="flex items-center gap-2">
                                <button onclick="app.closeIncomePanel()" class="text-sm px-3 py-1 rounded bg-gray-100">Close</button>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex gap-2 text-sm">
                                <button id="inc-tab-invoice" class="inc-tab px-3 py-1 rounded bg-gray-100">Invoice Income</button>
                                <button id="inc-tab-adjustment" class="inc-tab px-3 py-1 rounded bg-gray-100">Adjustment Income</button>
                            </div>
                        </div>
                        <div id="inc-panel-body"></div>
                        <div class="mt-4 border-t pt-2 text-right"><span class="text-sm mr-2">Total:</span><span id="inc-total" class="font-bold text-lg">0</span></div>
                    </div>
                `;
                document.getElementById('modal-container').appendChild(modal);
                document.getElementById('inc-tab-invoice').onclick = ()=>app.renderIncomePanel('invoice');
                document.getElementById('inc-tab-adjustment').onclick = ()=>app.renderIncomePanel('adjustment');
                app.renderIncomePanel(tab==='salary'?'invoice':tab);
            },

            closeIncomePanel: () => { const el = document.getElementById('income-panel'); if(el) el.remove(); },

            renderIncomePanel: (tab) => {
                const body = document.getElementById('inc-panel-body'); if(!body) return;
                // use previously computed reportPLData if available
                const r = state.reportPLData || { totalIncome:0, adjInTotal:0 };
                const invoiceOnly = (r.totalIncome || 0) - (r.adjInTotal || 0);
                const salaryList = state.salaryIncomes || [];
                const salarySum = salaryList.reduce((s,i)=>s+Number(i.amount||0),0);
                const adjIn = r.adjInTotal || 0;
                const total = invoiceOnly + salarySum + adjIn;
                document.getElementById('inc-total').innerText = total.toLocaleString();

                if(tab==='invoice'){
                    body.innerHTML = `<div class="text-sm">Invoice Income: <div class="mt-2 text-green-700 font-bold">${invoiceOnly.toLocaleString()}</div>
                        <div class="mt-3 text-xs text-gray-600">This is aggregated from invoice payments.</div></div>`;
                } else if(tab==='adjustment'){
                    body.innerHTML = `<div class="text-sm">Adjustment In: <div class="mt-2 text-green-700 font-bold">${adjIn.toLocaleString()}</div>
                        <div class="mt-3 text-xs text-gray-600">Positive adjustments and refunds counted as income.</div></div>`;
                } else {
                    // salary tab: show list and form
                    body.innerHTML = `
                        <div>
                            <div class="mb-3 text-sm font-medium">Salary Entries</div>
                            <div id="salary-list" class="space-y-2 mb-4">${salaryList.map((s,idx)=>`<div class="flex justify-between items-center p-2 border rounded"><div><div class="font-medium">${s.source||'-'} <span class="text-xs text-gray-400">(${s.type||'income'})</span></div><div class="text-xs text-gray-500">${s.company? s.company + ' • ' : ''}${s.method||'-'}</div></div><div class="font-bold">${Number(s.amount||0).toLocaleString()}</div></div>`).join('') || '<div class="text-xs text-gray-400">No salary entries</div>'}</div>

                            <form id="salary-form" class="space-y-2" onsubmit="app.saveSalaryIncome(event)">
                                <div class="grid grid-cols-1 md:grid-cols-6 gap-2">
                                    <input required name="source" placeholder="Entry title (e.g. Salary)" class="border p-2 rounded" />
                                    ${ (state.settings && state.settings.companies && state.settings.companies.length) ?
                                        `<select name="company" class="border p-2 rounded">${state.settings.companies.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>` :
                                        `<input name="company" placeholder="Company name (optional)" class="border p-2 rounded" />` }
                                    <select required name="method" class="border p-2 rounded">${(state.payment_methods && state.payment_methods.length? state.payment_methods.map(m=>`<option value="${m.name}">${m.name}</option>`).join('') : state.defaultMethods.map(m=>`<option value="${m.name}">${m.name}</option>`).join(''))}</select>
                                    <select required name="type" class="border p-2 rounded"><option value="income">Income</option><option value="expense">Expense</option></select>
                                    <input required name="amount" type="number" min="0" placeholder="Amount" class="border p-2 rounded" />
                                    <input name="period" type="month" class="border p-2 rounded" title="Select month and year (optional)" />
                                </div>
                                <div class="flex justify-end"><button type="submit" class="px-3 py-1 bg-green-600 text-white rounded">Add Salary</button></div>
                            </form>
                        </div>
                    `;
                }
            },

            saveSalaryIncome: async (ev) => {
                ev.preventDefault();
                const f = document.getElementById('salary-form'); if(!f) return;
                const fd = new FormData(f);
                const period = fd.get('period');
                const dateIso = period ? new Date(period + '-01').toISOString() : new Date().toISOString();
                const entry = { source: fd.get('source'), company: fd.get('company') || '', method: fd.get('method'), type: fd.get('type') || 'income', amount: Number(fd.get('amount')||0), date: dateIso };

                // Persist to Firestore when admin (so entries survive reloads)
                if(state.isAdmin && typeof addDoc === 'function'){
                    try {
                        const docRef = await addDoc(collection(db, 'salary_incomes'), entry);
                        entry.id = docRef.id;
                    } catch(e){ console.error('Failed to save salary to Firestore', e); }
                }

                state.salaryIncomes.push(entry);
                // update total display and re-render salary tab
                app.renderIncomePanel('salary');
            },
            renderReports: () => {
                const container = document.getElementById('dashboard-content');
                // Cleanup old charts
                if (state.charts.pie) state.charts.pie.destroy();
                if (state.charts.line) state.charts.line.destroy();

                const fYear = document.getElementById('filter-year').value;
                const fMonth = document.getElementById('filter-month').value;
                const fCust = document.getElementById('filter-customer').value;

                // 1. Data Prep: General Overview
                const checkDate = (timestamp) => {
                    if(!timestamp) return false;
                    const d = timestamp.seconds ? new Date(timestamp.seconds*1000) : new Date(timestamp);
                    if(fYear !== 'all' && d.getFullYear() != fYear) return false;
                    if(fMonth !== 'all' && d.getMonth() != fMonth) return false;
                    return true;
                };

                const filteredInvoices = state.invoices.filter(i => checkDate(i.createdAt) && (fCust === 'all' || i.clientName === fCust));
                const filteredExpenses = state.expenses.filter(e => checkDate(e.date)); 
                const filteredAdjustments = (state.adjustments||[]).filter(a => checkDate(a.date));
                
                let totalIncome = 0, totalExpense = 0, totalRefunds = 0, totalReceivable = 0;
                let adjInTotal = 0, adjOutTotal = 0;
                let manualInvCount = 0, manualInvTotal = 0;
                let convertedInvCount = 0, convertedInvTotal = 0;
                
                // NEW: Counters
                const totalInvCount = state.invoices.length;
                const totalQtnCount = state.quotations.length;
                // Count Invoice marked as converted source
                const convertedCount = state.invoices.filter(i => i.source === 'converted').length;

                const clientIncome = {};
                
                filteredInvoices.forEach(inv => {
                    const isManual = inv.source !== 'converted';
                    if (inv.status === 'refunded') {
                        let paid = inv.payments ? inv.payments.reduce((s,p)=>s+p.amount,0) : 0;
                        totalRefunds += paid;
                    } else {
                        if(isManual) { manualInvCount++; manualInvTotal += inv.totalAmount; }
                        else { convertedInvCount++; convertedInvTotal += inv.totalAmount; }

                        let paid = 0;
                        if(inv.payments) {
                            inv.payments.forEach(p => {
                                paid += p.amount;
                                totalIncome += p.amount;
                                
                                // Client Pivot Data
                                if(!clientIncome[inv.clientName]) clientIncome[inv.clientName] = 0;
                                clientIncome[inv.clientName] += p.amount;
                            });
                        }
                        if(paid < inv.totalAmount) totalReceivable += (inv.totalAmount - paid);
                    }
                });

                // Expense Pivot Data
                const expenseByCat = {};
                filteredExpenses.forEach(e => {
                    totalExpense += Number(e.amount);
                    const cat = e.category || 'Uncategorized';
                    if(!expenseByCat[cat]) expenseByCat[cat] = 0;
                    expenseByCat[cat] += Number(e.amount);
                });

                // Process adjustments: sign '+' or type 'refund' treated as income, otherwise expense
                filteredAdjustments.forEach(a => {
                    const amt = Number(a.amount || 0);
                    const isIncome = (a.sign === '+') || (a.type === 'refund');
                    if(isIncome) {
                        // Track positive adjustments under Adjustments In.
                        adjInTotal += amt;
                    } else {
                        // Negative adjustments count as expense (Adjustments Out)
                        adjOutTotal += amt;
                        totalExpense += amt;
                        const cat = a.category || 'Adjustment';
                        if(!expenseByCat[cat]) expenseByCat[cat] = 0;
                        expenseByCat[cat] += amt;
                    }
                });

                // Include adjustment "In" amounts into total income so Net Profit reflects them
                totalIncome += adjInTotal;

                // --- Salary entries (custom) ---
                const salaryFiltered = (state.salaryIncomes||[]).filter(s => {
                    if(!s.date) return true;
                    const d = new Date(s.date);
                    if(fYear !== 'all' && d.getFullYear() != fYear) return false;
                    if(fMonth !== 'all' && d.getMonth() != fMonth) return false;
                    return true;
                });
                const salaryIncomeSum = salaryFiltered.filter(s=> (s.type||'income')==='income').reduce((s,i)=>s+Number(i.amount||0),0);
                const salaryExpenseSum = salaryFiltered.filter(s=> (s.type||'income')==='expense').reduce((s,i)=>s+Number(i.amount||0),0);
                // Add salary income to income, and salary expense to expense totals
                totalIncome += salaryIncomeSum;
                totalExpense += salaryExpenseSum;

                // Prepare monthly expense arrays (for green/red line chart)
                const currentYear = new Date().getFullYear();
                const selectedYear = fYear === 'all' ? currentYear : parseInt(fYear);
                const prevYear = selectedYear - 1;
                const monthlyExpenseCurrent = new Array(12).fill(0);
                const monthlyExpensePrev = new Array(12).fill(0);
                // Add regular expenses
                filteredExpenses.forEach(e => {
                    const d = new Date(e.date);
                    const m = d.getMonth(); const y = d.getFullYear(); const amt = Number(e.amount || 0);
                    if (y === selectedYear) monthlyExpenseCurrent[m] += amt;
                    if (y === prevYear) monthlyExpensePrev[m] += amt;
                });
                // Add adjustments that are not refunds as expenses
                filteredAdjustments.forEach(a => {
                    if(a.type !== 'refund' && a.date) {
                        const d = new Date(a.date);
                        const m = d.getMonth(); const y = d.getFullYear(); const amt = Number(a.amount || 0);
                        if (y === selectedYear) monthlyExpenseCurrent[m] += amt;
                        if (y === prevYear) monthlyExpensePrev[m] += amt;
                    }
                });

                const netProfit = totalIncome - totalExpense;

                // --- Payment Method Aggregation (for column chart) ---
                const paymentMethodSums = {};
                const methodsList = (state.payment_methods && state.payment_methods.length > 0) ? state.payment_methods.map(m => m.name) : state.defaultMethods.map(m => m.name);
                methodsList.forEach(m => { paymentMethodSums[m] = { in: 0, out: 0 }; });

                // Aggregate from invoice payments
                filteredInvoices.forEach(inv => {
                    if (inv.payments) {
                        inv.payments.forEach(p => {
                            const m = p.method || 'Unknown';
                            if (!paymentMethodSums[m]) paymentMethodSums[m] = { in: 0, out: 0 };
                            paymentMethodSums[m].in += Number(p.amount || 0);
                        });
                    }
                });

                // Aggregate from expenses
                filteredExpenses.forEach(e => {
                    const m = e.method || 'Unknown';
                    if (!paymentMethodSums[m]) paymentMethodSums[m] = { in: 0, out: 0 };
                    paymentMethodSums[m].out += Number(e.amount || 0);
                });

                // Aggregate from adjustments
                filteredAdjustments.forEach(a => {
                    const m = a.method || 'Unknown';
                    if (!paymentMethodSums[m]) paymentMethodSums[m] = { in: 0, out: 0 };
                    const amt = Number(a.amount || 0);
                    const isIncome = (a.sign === '+') || (a.type === 'refund');
                    if (isIncome) paymentMethodSums[m].in += amt; else paymentMethodSums[m].out += amt;
                });

                // Aggregate from salary entries
                (salaryFiltered||[]).forEach(s => {
                    const m = s.method || 'Unknown';
                    if (!paymentMethodSums[m]) paymentMethodSums[m] = { in: 0, out: 0 };
                    const amt = Number(s.amount || 0);
                    if ((s.type||'income') === 'income') paymentMethodSums[m].in += amt; else paymentMethodSums[m].out += amt;
                });

                // Save summary for download/export (now that paymentMethodSums exists)
                state.reportPLData = {
                    totalIncome, totalExpense, adjInTotal, adjOutTotal, netProfit,
                    totalReceivable, totalRefunds, paymentMethodSums: paymentMethodSums,
                    year: fYear, month: fMonth, salaryIncomeSum, salaryExpenseSum
                };

                // Prepare monthly detail rows if a specific month filter is selected
                let monthDetailRowsHtml = '';
                if (fMonth !== 'all') {
                    const combined = [];
                    // Invoice payments as income rows (In column)
                    filteredInvoices.forEach(inv => {
                        if (inv.payments && inv.payments.length) {
                            inv.payments.forEach(p => combined.push({ date: new Date(p.date), type: 'Payment', desc: inv.clientName || (inv.note||''), method: p.method||'Unknown', in: Number(p.amount || 0), out: 0 }));
                        } else {
                            // invoice without payment (show as receivable in In column)
                            const d = inv.createdAt && inv.createdAt.seconds ? new Date(inv.createdAt.seconds*1000) : new Date();
                            combined.push({ date: d, type: 'Invoice (Unpaid)', desc: inv.clientName || '', method: '', in: Number(inv.totalAmount || 0), out: 0 });
                        }
                    });
                    // Expenses go to Out column
                    filteredExpenses.forEach(e => combined.push({ date: new Date(e.date), type: 'Expense', desc: e.title || '', method: e.method||'Unknown', in: 0, out: Number(e.amount || 0) }));
                    // Adjustments: decide In or Out based on sign/type
                    filteredAdjustments.forEach(a => {
                        const amt = Number(a.amount || 0);
                        const isIncome = (a.sign === '+') || (a.type === 'refund');
                        combined.push({ date: new Date(a.date), type: a.type === 'refund' ? 'Refund' : 'Adjustment', desc: a.title || '', method: a.method||'Unknown', in: isIncome ? amt : 0, out: isIncome ? 0 : amt });
                    });

                    combined.sort((A,B)=>A.date - B.date);

                    monthDetailRowsHtml = combined.map(r => `
                        <tr class="hover:bg-gray-50">
                            <td class="p-2 text-xs">${r.date.toLocaleDateString()}</td>
                            <td class="p-2 text-xs font-medium">${r.type}</td>
                            <td class="p-2 text-xs">${r.desc}</td>
                            <td class="p-2 text-xs">${r.method || '-'}</td>
                            <td class="p-2 text-right text-sm text-green-700">${r.in? r.in.toLocaleString():''}</td>
                            <td class="p-2 text-right text-sm text-red-600">${r.out? r.out.toLocaleString():''}</td>
                        </tr>
                    `).join('');
                }

                // 2. Data Prep: Line Chart

                const monthlyIncomeCurrent = new Array(12).fill(0);
                const monthlyIncomePrev = new Array(12).fill(0);

                state.invoices.forEach(inv => {
                    if (inv.status !== 'refunded' && inv.payments) {
                        inv.payments.forEach(p => {
                            const d = new Date(p.date);
                            const m = d.getMonth();
                            const y = d.getFullYear();
                            if (y === selectedYear) monthlyIncomeCurrent[m] += p.amount;
                            if (y === prevYear) monthlyIncomePrev[m] += p.amount;
                        });
                    }
                });

                // Note: adjustments are shown separately in the Adjustments card/table

                // Prepare some complex HTML fragments to avoid nested template literal parsing issues
                const salaryByCompanyHtml = (() => {
                    const sb = {};
                    (salaryFiltered||[]).forEach(s => {
                        if((s.type||'income') === 'income'){
                            const c = s.company || 'Unknown';
                            sb[c] = (sb[c]||0) + Number(s.amount||0);
                        }
                    });
                    return Object.entries(sb).sort((a,b)=>b[1]-a[1]).map(([comp,amt])=>{
                        return `<tr><td class="p-3 font-medium">${comp}</td><td class="p-3 text-right text-green-600">${amt.toLocaleString()}</td><td class="p-3 text-right text-gray-500">${totalIncome>0?Math.round((amt/totalIncome)*100)+'%':'0%'}</td></tr>`
                    }).join('');
                })();

                // --- UI Rendering ---
                container.innerHTML = `
                <div class="p-4 bg-gray-50 min-h-screen space-y-6">
                    <div class="flex gap-4 mb-4">
                        <div class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-bold flex-1 text-center border border-blue-200">
                            Total Invoices: <span class="text-lg block">${totalInvCount}</span>
                        </div>
                        <div class="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-bold flex-1 text-center border border-purple-200">
                            Total Quotations: <span class="text-lg block">${totalQtnCount}</span>
                        </div>
                        <div class="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-bold flex-1 text-center border border-green-200">
                            Converted (Q to I): <span class="text-lg block">${convertedCount}</span>
                        </div>
                    </div>

                    <h3 class="font-bold text-lg text-gray-700">${app.t('financial_overview')} (${fYear==='all'?'All':fYear})</h3>
                    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <button onclick="app.openIncomePanel()" class="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 text-left hover:bg-gray-50 transition-colors">
                                <div class="text-xs text-gray-500 uppercase">${app.t('income')}</div>
                                <div class="text-xl font-bold text-green-600" title="Salary: ${salaryIncomeSum && totalIncome? Math.round((salaryIncomeSum/totalIncome)*100) : 0}%">${totalIncome.toLocaleString()}</div>
                        </button>
                        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                            <div class="text-xs text-gray-500 uppercase">${app.t('expense_label')}</div>
                            <div class="text-xl font-bold text-red-600">${totalExpense.toLocaleString()}</div>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                            <div class="text-xs text-gray-500 uppercase">${app.t('net_profit')}</div>
                            <div class="text-xl font-bold text-blue-600">${netProfit.toLocaleString()}</div>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                            <div class="text-xs text-gray-500 uppercase">${app.t('receivable')}</div>
                            <div class="text-xl font-bold text-yellow-600">${totalReceivable.toLocaleString()}</div>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                            <div class="text-xs text-gray-500 uppercase">${app.t('refund_total')}</div>
                            <div class="text-xl font-bold text-orange-600">${totalRefunds.toLocaleString()}</div>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                            <div class="text-xs text-gray-500 uppercase">Adjustments</div>
                            <div class="mt-2 flex gap-4">
                                <div class="flex-1 text-center">
                                    <div class="text-xs text-gray-500">In</div>
                                    <div class="text-lg font-bold text-green-600">${adjInTotal.toLocaleString()}</div>
                                </div>
                                <div class="flex-1 text-center">
                                    <div class="text-xs text-gray-500">Out</div>
                                    <div class="text-lg font-bold text-red-600">${adjOutTotal.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-4 rounded-lg shadow border">
                                <h4 class="font-bold text-gray-600 mb-4 text-sm">Payment Methods - Inflow / Outflow</h4>
                                <div class="relative h-64"><canvas id="methodBarChart"></canvas></div>
                            </div>
                        <div class="bg-white p-4 rounded-lg shadow border">
                                <h4 class="font-bold text-gray-600 mb-4 text-sm">Monthly Income Trend (${selectedYear} vs ${prevYear})</h4>
                                <div class="relative h-64"><canvas id="lineChart"></canvas></div>
                            </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white rounded-lg shadow border overflow-hidden">
                            <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">Expense By Category</div>
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th class="p-3 text-left">Category</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">%</th></tr></thead>
                                <tbody class="divide-y">
                                    ${Object.entries(expenseByCat).sort((a,b)=>b[1]-a[1]).map(([cat, amt]) => `
                                        <tr>
                                            <td class="p-3">${cat}</td>
                                            <td class="p-3 text-right text-red-600">${amt.toLocaleString()}</td>
                                            <td class="p-3 text-right text-gray-500">${totalExpense>0 ? Math.round((amt/totalExpense)*100)+'%' : '0%'}</td>
                                        </tr>
                                    `).join('')}
                                    ${Object.keys(expenseByCat).length===0 ? '<tr><td colspan="3" class="p-4 text-center text-gray-400">No expenses found</td></tr>' : ''}
                                </tbody>
                            </table>
                        </div>

                                <div class="space-y-4">
                                    <div class="bg-white rounded-lg shadow border overflow-hidden">
                                        <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">By Client (Invoices)</div>
                                        <table class="w-full text-sm">
                                            <thead class="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th class="p-3 text-left">Client</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">%</th></tr></thead>
                                            <tbody class="divide-y">
                                                ${Object.entries(clientIncome).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([cli, amt])=>`<tr><td class="p-3 font-medium">${cli}</td><td class="p-3 text-right text-green-600">${amt.toLocaleString()}</td><td class="p-3 text-right text-gray-500">${totalIncome>0?Math.round((amt/totalIncome)*100)+'%':'0%'}</td></tr>`).join('')}
                                                ${Object.keys(clientIncome).length===0? '<tr><td colspan="3" class="p-4 text-center text-gray-400">No invoice income</td></tr>':''}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="bg-white rounded-lg shadow border overflow-hidden">
                                        <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">By Company (Salaries)</div>
                                        <table class="w-full text-sm">
                                            <thead class="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th class="p-3 text-left">Company</th><th class="p-3 text-right">Amount</th><th class="p-3 text-right">%</th></tr></thead>
                                            <tbody class="divide-y">
                                                ${salaryByCompanyHtml}
                                                ${ (salaryFiltered||[]).filter(s=> (s.type||'income')==='income').length===0 ? '<tr><td colspan="3" class="p-4 text-center text-gray-400">No salary income</td></tr>' : '' }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="bg-white rounded-lg shadow border overflow-hidden">
                                        <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">Adjustments (In)</div>
                                        <table class="w-full text-sm">
                                            <thead class="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th class="p-3 text-left">Desc</th><th class="p-3 text-right">Amount</th></tr></thead>
                                            <tbody class="divide-y">
                                                ${filteredAdjustments.filter(a=> (a.sign==='+'||a.type==='refund')).map(a=>`<tr><td class="p-3">${a.title||a.note||a.type||'Adjustment'}</td><td class="p-3 text-right text-green-600">${Number(a.amount||0).toLocaleString()}</td></tr>`).join('')}
                                                ${filteredAdjustments.filter(a=> (a.sign==='+'||a.type==='refund')).length===0? '<tr><td colspan="2" class="p-4 text-center text-gray-400">No positive adjustments found</td></tr>':''}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                    </div>
                </div>`;

                // --- Render Charts ---
                // Payment Method Column Chart
                if (state.charts.methodBar) state.charts.methodBar.destroy();
                const methodKeys = Object.keys(paymentMethodSums);
                const methodInValues = methodKeys.map(k => paymentMethodSums[k].in);
                const methodOutValues = methodKeys.map(k => paymentMethodSums[k].out);
                const ctxMethod = document.getElementById('methodBarChart').getContext('2d');
                state.charts.methodBar = new Chart(ctxMethod, {
                    type: 'bar',
                    data: {
                        labels: methodKeys,
                        datasets: [
                            { label: 'Inflow', data: methodInValues, backgroundColor: '#10B981' },
                            { label: 'Outflow', data: methodOutValues, backgroundColor: '#EF4444' }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { x: { stacked: false }, y: { stacked: false } } }
                });

                // Monthly Income Trend -> Grouped Column Chart (bar)
                const ctxLine = document.getElementById('lineChart').getContext('2d');
                if (state.charts.line) state.charts.line.destroy();
                state.charts.line = new Chart(ctxLine, {
                    type: 'bar',
                    data: {
                        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                        datasets: [
                            {
                                label: `${selectedYear}`,
                                data: monthlyIncomeCurrent,
                                backgroundColor: '#3B82F6'
                            },
                            {
                                label: `${prevYear}`,
                                data: monthlyIncomePrev,
                                backgroundColor: '#9CA3AF'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        scales: {
                            x: { stacked: false },
                            y: { stacked: false, beginAtZero: true }
                        }
                    }
                });

                // --- Green/Red Line Chart (Income vs Expense) ---
                const grContainer = document.createElement('div');
                grContainer.className = 'bg-white p-4 rounded-lg shadow border mt-6';
                grContainer.innerHTML = `<h4 class="font-bold text-gray-600 mb-4 text-sm">Income (Green) vs Expense (Red) - ${selectedYear}</h4><div class="relative h-64"><canvas id="grLineChart"></canvas></div>`;
                document.querySelector('.p-4.bg-gray-50.min-h-screen.space-y-6').appendChild(grContainer);

                const monthlyExpenseCurrentFinal = typeof monthlyExpenseCurrent !== 'undefined' ? monthlyExpenseCurrent : new Array(12).fill(0);
                const monthlyExpensePrevFinal = typeof monthlyExpensePrev !== 'undefined' ? monthlyExpensePrev : new Array(12).fill(0);

                const ctxGr = document.getElementById('grLineChart').getContext('2d');
                if(state.charts.grLine) state.charts.grLine.destroy();
                state.charts.grLine = new Chart(ctxGr, {
                    type: 'line',
                    data: {
                        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                        datasets: [
                            { label: 'Income', data: monthlyIncomeCurrent, borderColor: '#10B981', backgroundColor: '#10B98122', tension: 0.3, fill: false },
                            { label: 'Expense', data: monthlyExpenseCurrentFinal, borderColor: '#EF4444', backgroundColor: '#EF444422', tension: 0.3, fill: false }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // If month filter selected, append detailed transactions table for that month
                if (fMonth !== 'all') {
                    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                    const md = document.createElement('div');
                    md.className = 'bg-white p-4 rounded-lg shadow border mt-6';
                    md.innerHTML = `
                        <div class="bg-gray-50 p-3 border-b font-bold text-gray-700 text-sm">Details for ${monthNames[Number(fMonth)]} ${fYear}</div>
                        <div class="p-3 overflow-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th class="p-2 text-left">Date</th><th class="p-2 text-left">Type</th><th class="p-2 text-left">Desc / Client</th><th class="p-2 text-left">Method</th><th class="p-2 text-right">In</th><th class="p-2 text-right">Out</th></tr></thead>
                                <tbody class="divide-y">
                                    ${monthDetailRowsHtml || '<tr><td colspan="5" class="p-4 text-center text-gray-400">No transactions for this month.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    `;
                    document.querySelector('.p-4.bg-gray-50.min-h-screen.space-y-6').appendChild(md);
                }

                // Append Profit & Loss summary at the bottom of the page
                const plContainer = document.createElement('div');
                plContainer.className = 'bg-white p-4 rounded-lg shadow border mt-6';
                plContainer.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <div>
                            <div class="text-xs text-gray-500 uppercase font-bold">Profit & Loss Summary</div>
                            <div class="text-sm text-gray-700">${fYear==='all'?'All Years':fYear} ${fMonth==='all'?'':'- '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(fMonth)]}</div>
                        </div>
                        <div>
                            <button onclick="app.downloadPLCSV()" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Download CSV</button>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <div class="flex justify-between"><span>Total Income</span><span class="font-bold text-green-600">${totalIncome.toLocaleString()}</span></div>
                        <div class="flex justify-between"><span>Total Expense</span><span class="font-bold text-red-600">${totalExpense.toLocaleString()}</span></div>
                        <div class="flex justify-between"><span>Adjustments In</span><span class="font-bold text-green-600">${adjInTotal.toLocaleString()}</span></div>
                        <div class="flex justify-between"><span>Adjustments Out</span><span class="font-bold text-red-600">${adjOutTotal.toLocaleString()}</span></div>
                        <div class="flex justify-between border-t pt-2 mt-2 font-bold"><span>Net Profit</span><span class="text-blue-600">${netProfit.toLocaleString()}</span></div>
                    </div>
                `;
                document.querySelector('.p-4.bg-gray-50.min-h-screen.space-y-6').appendChild(plContainer);
            }
        };
        window.app = app; app.init();
    </script>
