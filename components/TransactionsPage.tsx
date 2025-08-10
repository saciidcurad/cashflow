


import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Book, Transaction } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useCurrency, useLanguage } from '../contexts';
import { useLocale } from '../hooks/useLocale';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from './icons/Icon';

interface TransactionsPageProps {
    book: Book;
    onNewTransactionClick: (book: Book, type: 'income' | 'expense') => void;
    onEditTransactionClick: (tx: Transaction) => void;
    onDeleteTransactionClick: (tx: Transaction) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({
    book,
    onNewTransactionClick,
    onEditTransactionClick,
    onDeleteTransactionClick,
}) => {
    const t = useTranslations();
    const { currency } = useCurrency();
    const locale = useLocale();
    const { language } = useLanguage();
    const [openMenuTxId, setOpenMenuTxId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuTxId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { groupedTransactions, summary } = useMemo(() => {
        const sorted = [...book.transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let runningBalance = 0;
        let totalIn = 0;
        let totalOut = 0;
        
        const transactionsWithBalance = sorted.map(tx => {
            if (tx.type === 'income') {
                runningBalance += tx.amount;
                totalIn += tx.amount;
            } else {
                runningBalance -= tx.amount;
                totalOut += tx.amount;
            }
            return { ...tx, balance: runningBalance };
        }).reverse();

        const groups = transactionsWithBalance.reduce((acc, tx) => {
            const date = new Date(tx.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(tx);
            return acc;
        }, {} as Record<string, (Transaction & { balance: number })[]>);

        return { 
            groupedTransactions: Object.entries(groups),
            summary: {
                income: totalIn,
                expense: totalOut,
                balance: totalIn - totalOut,
            }
        };
    }, [book.transactions, locale]);
    
    return (
        <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-y-auto pb-24">
                 <div className="max-w-4xl mx-auto p-4 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                            <div>
                                <p className="text-sm text-green-600 dark:text-green-400">{t.transactions.totalIn}</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.income.toLocaleString(locale, { style: 'currency', currency })}</p>
                            </div>
                            <div className="text-right rtl:text-left">
                                <p className="text-sm text-red-600 dark:text-red-400">{t.transactions.totalOut}</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.expense.toLocaleString(locale, { style: 'currency', currency })}</p>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.transactions.netBookBalance}</p>
                            <p className={`text-lg font-bold ${summary.balance > 0 ? 'text-green-600 dark:text-green-400' : summary.balance < 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>{summary.balance.toLocaleString(locale, { style: 'currency', currency })}</p>
                        </div>
                    </div>
                    
                    {groupedTransactions.length > 0 ? groupedTransactions.map(([date, transactions]) => (
                        <div key={date}>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">{date}</p>
                            <div className="space-y-2">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800 dark:text-gray-100">{tx.description}</p>
                                                {tx.creatorName && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {t.transactions.entryBy.replace('{name}', tx.creatorName)}
                                                        {tx.entryTimestamp && ` at ${new Date(tx.entryTimestamp).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right rtl:text-left flex-shrink-0 ml-4 flex items-center gap-2">
                                                <div className="text-right rtl:text-left">
                                                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{tx.amount.toLocaleString(locale, {style: 'currency', currency})}</p>
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {t.dashboard.balance}: <span className={`font-semibold ${tx.balance > 0 ? 'text-green-600 dark:text-green-400' : tx.balance < 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>{tx.balance.toLocaleString(locale, {style:'currency', currency})}</span>
                                                  </p>
                                                </div>
                                                <div className="relative">
                                                  <button
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setOpenMenuTxId(openMenuTxId === tx.id ? null : tx.id);
                                                      }}
                                                      className="p-1 -m-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full"
                                                  >
                                                      <EllipsisVerticalIcon className="w-5 h-5"/>
                                                  </button>
                                                  {openMenuTxId === tx.id && (
                                                      <div ref={menuRef} className="absolute top-full end-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 animate-fade-in-sm">
                                                        <ul className="py-1">
                                                              <li>
                                                                  <button
                                                                      onClick={() => {
                                                                          onEditTransactionClick(tx);
                                                                          setOpenMenuTxId(null);
                                                                      }}
                                                                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                  >
                                                                      <PencilIcon className="w-4 h-4"/>
                                                                      <span>{t.modals.edit}</span>
                                                                  </button>
                                                              </li>
                                                              <li>
                                                                  <button
                                                                      onClick={() => {
                                                                          onDeleteTransactionClick(tx);
                                                                          setOpenMenuTxId(null);
                                                                      }}
                                                                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                                                                  >
                                                                      <TrashIcon className="w-4 h-4"/>
                                                                      <span>{t.modals.delete}</span>
                                                                  </button>
                                                              </li>
                                                        </ul>
                                                        <style>{`
                                                            @keyframes fade-in-sm { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                                                            .animate-fade-in-sm { animation: fade-in-sm 0.1s ease-out; transform-origin: top right; }
                                                            .rtl .animate-fade-in-sm { transform-origin: top left; }
                                                        `}</style>
                                                      </div>
                                                  )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center p-12 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                            <p className="font-semibold text-gray-600 dark:text-gray-300 text-lg">{t.transactions.noTransactions}</p>
                        </div>
                    )}
                 </div>
            </main>
            
            <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-20">
                <div className="max-w-4xl mx-auto p-3 flex gap-3">
                    <button onClick={() => onNewTransactionClick(book, 'income')} className="flex-1 py-3 bg-primary-600 text-white font-bold rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                        {t.transactions.addCashIn.toUpperCase()}
                    </button>
                    <button onClick={() => onNewTransactionClick(book, 'expense')} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors">
                        {t.transactions.addCashOut.toUpperCase()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
