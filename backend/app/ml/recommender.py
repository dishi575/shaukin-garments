"""
Shaukin Garments — Recommendation Engine

Hybrid approach:
1. Content-based: TF-IDF on product name + category + fabric + meta_tags,
   cosine similarity -> "similar products"
2. Collaborative signal: co-occurrence in the same user's interaction history
   -> "frequently bought/viewed together"
3. Category-sector boost: B2B clients get recommendations weighted toward
   their own sector's typical co-purchases (e.g. hospital buyers see OT linens)
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from collections import defaultdict
from typing import List, Dict, Any


def build_product_corpus(products: List[Any]) -> List[str]:
    corpus = []
    for p in products:
        parts = [
            p.name or "",
            p.category.name if p.category else "",
            p.fabric or "",
            p.product_type or "",
            " ".join(p.meta_tags or []),
            p.description or "",
        ]
        corpus.append(" ".join(parts))
    return corpus


def content_based_similarity(products: List[Any]) -> np.ndarray:
    if len(products) < 2:
        return np.zeros((len(products), len(products)))
    corpus = build_product_corpus(products)
    vectorizer = TfidfVectorizer(stop_words="english", max_features=500)
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        return cosine_similarity(tfidf_matrix)
    except ValueError:
        return np.zeros((len(products), len(products)))


def get_similar_products(product_id: str, products: List[Any], top_n: int = 4) -> List[str]:
    ids = [str(p.id) for p in products]
    if product_id not in ids or len(products) < 2:
        return []

    sim_matrix = content_based_similarity(products)
    idx = ids.index(product_id)
    scores = list(enumerate(sim_matrix[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    similar_ids = []
    for i, score in scores:
        if i == idx or score <= 0:
            continue
        similar_ids.append(ids[i])
        if len(similar_ids) >= top_n:
            break
    return similar_ids


def get_frequently_bought_together(
    product_id: str,
    interactions: List[Dict[str, Any]],
    top_n: int = 4,
) -> List[str]:
    sessions = defaultdict(set)
    weights = defaultdict(float)
    for inter in interactions:
        key = inter.get("user_id") or inter.get("session_id")
        if not key:
            continue
        sessions[key].add(inter["product_id"])
        weights[inter["product_id"]] = max(weights[inter["product_id"]], inter.get("weight", 1.0))

    co_occurrence = defaultdict(float)
    for key, product_set in sessions.items():
        if product_id in product_set:
            for other_id in product_set:
                if other_id != product_id:
                    co_occurrence[other_id] += weights.get(other_id, 1.0)

    ranked = sorted(co_occurrence.items(), key=lambda x: x[1], reverse=True)
    return [pid for pid, _ in ranked[:top_n]]


def get_hybrid_recommendations(
    product_id: str,
    products: List[Any],
    interactions: List[Dict[str, Any]],
    top_n: int = 4,
) -> List[str]:
    collab = get_frequently_bought_together(product_id, interactions, top_n=top_n)
    if len(collab) >= top_n:
        return collab[:top_n]

    content = get_similar_products(product_id, products, top_n=top_n)
    combined = collab.copy()
    for pid in content:
        if pid not in combined and pid != product_id:
            combined.append(pid)
        if len(combined) >= top_n:
            break
    return combined[:top_n]


def get_sector_recommendations(category_slug: str, products: List[Any], top_n: int = 6) -> List[str]:
    SECTOR_AFFINITY = {
        "hospital": ["linens", "sarees"],
        "school": ["corporate"],
        "petrol-pump": ["industrial", "corporate"],
        "industrial": ["petrol-pump"],
        "corporate": ["sarees"],
        "linens": ["hospital"],
        "sarees": ["hospital", "corporate"],
    }
    related_slugs = SECTOR_AFFINITY.get(category_slug, [])
    if not related_slugs:
        return []
    matched = [str(p.id) for p in products if p.category and p.category.slug in related_slugs]
    return matched[:top_n]
