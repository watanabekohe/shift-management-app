"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebaseをインポート
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function Schedule() {
    const [shifts, setShifts] = useState([]);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [editingId, setEditingId] = useState(null); // 編集中のIDを保存
    const [editName, setEditName] = useState("");
    const [editDate, setEditDate] = useState("");

    // Firestoreからシフトを取得
    useEffect(() => {
        const fetchShifts = async () => {
            const querySnapshot = await getDocs(collection(db, "shifts"));
            const fetchedShifts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setShifts(fetchedShifts);
        };
        fetchShifts();
    }, []);

    // シフトをFirestoreに保存
    const addShift = async () => {
        if (!name || !date) return; // 空の入力を防ぐ

        try {
            const newShift = { name, date };
            const docRef = await addDoc(collection(db, "shifts"), newShift);

            setShifts([...shifts, { id: docRef.id, ...newShift }]); // 画面にも即時反映
            setName("");
            setDate("");
        } catch (error) {
            console.error("シフトの追加に失敗しました", error);
        }
    };

    // シフトを削除
    const deleteShift = async (id) => {
        try {
            await deleteDoc(doc(db, "shifts", id));
            setShifts(shifts.filter((shift) => shift.id !== id));
        } catch (error) {
            console.error("シフトの削除に失敗しました", error);
        }
    };

    // シフトの編集を開始
    const startEdit = (shift) => {
        setEditingId(shift.id);
        setEditName(shift.name);
        setEditDate(shift.date);
    };

    // シフトを更新
    const updateShift = async () => {
        if (!editName || !editDate || !editingId) return;

        try {
            await updateDoc(doc(db, "shifts", editingId), {
                name: editName,
                date: editDate,
            });

            setShifts(
                shifts.map((shift) =>
                    shift.id === editingId ? { ...shift, name: editName, date: editDate } : shift
                )
            );
            setEditingId(null);
            setEditName("");
            setEditDate("");
        } catch (error) {
            console.error("シフトの更新に失敗しました", error);
        }
    };


    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 mt-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">シフト管理システム 🚀</h1>

            {/* シフト表 */}
            <table className="w-full border-collapse border border-gray-300 bg-white text-black">
                <thead>
                    <tr className="bg-gray-100 text-black">
                        <th className="border p-3">日付</th>
                        <th className="border p-3">名前</th>
                        <th className="border p-3">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.map((shift) => (
                        <tr key={shift.id} className="hover:bg-gray-50">
                            <td className="border p-3 text-center">{shift.date}</td>
                            <td className="border p-3 text-center">{shift.name}</td>
                            <td className="border p-3 text-center">
                                <button
                                    onClick={() => deleteShift(shift.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 mr-2"
                                >
                                    削除
                                </button>
                                <button
                                    onClick={() => startEdit(shift)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
                                >
                                    編集
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 編集フォーム */}
            {editingId && (
                <div className="mt-6 p-4 border rounded-md bg-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">シフトを編集</h2>
                    <input
                        type="text"
                        placeholder="名前"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={updateShift}
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        更新
                    </button>
                </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">シフトを追加</h2>
            <input
                type="text"
                placeholder="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
            />
            <button
                onClick={addShift}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                追加
            </button>
        </div>
    );
}

