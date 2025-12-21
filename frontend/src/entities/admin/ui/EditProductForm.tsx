"use client";

import { useState } from 'react';
import { updateProduct } from '../lib/api';
import styles from './Admin.module.css';

interface EditProductFormProps {
    onClose: () => void;
    onBack: () => void;
}

export function EditProductForm({ onClose, onBack }: EditProductFormProps) {
    const [formData, setFormData] = useState({
        productName: '',
        name: '',
        description: '',
        volume: '',
        price: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const updateData: any = {};
            if (formData.name) updateData.name = formData.name;
            if (formData.description) updateData.description = formData.description;
            if (formData.volume) updateData.volume = parseInt(formData.volume);
            if (formData.price) updateData.price = formData.price;

            await updateProduct(formData.productName, updateData);

            setSuccess('Товар успешно изменен!');
            setFormData({ productName: '', name: '', description: '', volume: '', price: '' });

        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <button onClick={onBack} className={styles.backButton}>
                    ← Вернуться
                </button>
                <h3 className={styles.formTitle}>Изменить товар</h3>
                <div></div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Название товара для изменения *</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                        placeholder="Введите название существующего товара"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Новое название (необязательно)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Введите новое название"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Новое описание (необязательно)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={styles.formTextarea}
                        placeholder="Введите новое описание"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Новый объем (мл, необязательно)</label>
                    <input
                        type="text"
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                        min="1"
                        pattern="^\d+$"
                        className={styles.formInput}
                        placeholder="Введите новый объем"
                    />
                    <p className={styles.hint}>Формат: 300</p>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Новая цена (руб., необязательно)</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        pattern="^\d+(\.\d{1,2})?$"
                        className={styles.formInput}
                        placeholder="Введите новую цену"
                    />
                    <p className={styles.hint}>Формат: 199.99</p>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.cancelButton}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Изменение...' : 'Изменить товар'}
                    </button>
                </div>
            </form>
        </div>
    );
}