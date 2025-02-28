import { beforeAll, describe, expect, test } from '@jest/globals';
import { Item } from '../services/Objects';
import { GetItem } from '../services/ItemService';

let mockItemsList: { [id: string]: Item };
const mockItem: Item = {
    id: 'fomo',
    name: 'FOMO',
    description: 'Makes stock crash',
    price: 1_000,
    function: (): void => {}
};

beforeAll(() => {
    mockItemsList = {
        [mockItem.id]: mockItem
    };
});

describe('Buy Item', () => {
    test('should return ok response if normal', () => {
        expect(true).toBe(true);
    });

    test('should return false response if item is not found', () => {});
    test('should return false response if cash on runFile is not enough', () => {});
});

describe('Sell Item', () => {});

describe('Get Item', () => {
    test('should return item if item exist', () => {
        const result = GetItem(mockItemsList, mockItem.id);
        expect(result.id).toMatch(mockItem.id);
        expect(result.name).toMatch(mockItem.name);
        expect(result.description).toMatch(mockItem.description);
        expect(result.price).toEqual(mockItem.price);
        expect(result.function).toBe(result.function);
        expect(result).toBe(mockItem);
    });
    test('should return undefined if given string is empty', () => {
        const result = GetItem(mockItemsList, '');
        expect(result).not.toBeDefined();
    });
    test('should return undefined if item does not exist', () => {
        const result = GetItem(mockItemsList, 'else');
        expect(result).not.toBeDefined();
    });
});
