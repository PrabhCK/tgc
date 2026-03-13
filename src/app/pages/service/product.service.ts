import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface InventoryStatus {
    label: string;
    value: string;
}

export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

@Injectable()
export class ProductService {
    getProductsData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            
        ];
    }

    getProductsWithOrdersData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5,
                orders: [
                    {
                        id: '1000-0',
                        productCode: 'f230fh0g3',
                        date: '2020-09-13',
                        amount: 65,
                        quantity: 1,
                        customer: 'David James',
                        status: 'PENDING'
                    },
                    {
                        id: '1000-1',
                        productCode: 'f230fh0g3',
                        date: '2020-05-14',
                        amount: 130,
                        quantity: 2,
                        customer: 'Leon Rodrigues',
                        status: 'DELIVERED'
                    },
                    
                ]
            }
            
        ];
    }

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    productNames: string[] = [
        'Bamboo Watch',
        'Black Watch',
        'Blue Band',
        'Blue T-Shirt',
        'Bracelet',
        'Brown Purse',
        'Chakra Bracelet',
        'Galaxy Earrings',
        'Game Controller',
        'Gaming Set',
        'Gold Phone Case',
        'Green Earbuds',
        'Green T-Shirt',
        'Grey T-Shirt',
        'Headphones',
        'Light Green T-Shirt',
        'Lime Band',
        'Mini Speakers',
        'Painted Phone Case',
        'Pink Band',
        'Pink Purse',
        'Purple Band',
        'Purple Gemstone Necklace',
        'Purple T-Shirt',
        'Shoes',
        'Sneakers',
        'Teal T-Shirt',
        'Yellow Earbuds',
        'Yoga Mat',
        'Yoga Set'
    ];

    constructor(private http: HttpClient) {}

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    }

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    }

    getProducts() {
        return Promise.resolve(this.getProductsData());
    }

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    }

    generatePrduct(): Product {
        const product: Product = {
            id: this.generateId(),
            name: this.generateName(),
            description: 'Product Description',
            price: this.generatePrice(),
            quantity: this.generateQuantity(),
            category: 'Product Category',
            inventoryStatus: this.generateStatus(),
            rating: this.generateRating()
        };

        product.image = product.name?.toLocaleLowerCase().split(/[ ,]+/).join('-') + '.jpg';
        return product;
    }

    generateId() {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateName() {
        return this.productNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generatePrice() {
        return Math.floor(Math.random() * Math.floor(299) + 1);
    }

    generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75) + 1);
    }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    generateRating() {
        return Math.floor(Math.random() * Math.floor(5) + 1);
    }
}
