

def show_search(request):
    # Get query from URL
    query_text = request.GET.get('query', 'I love IU')
    query_embed_vector = model.encode([query_text])
    query_embed_vector = np.array(query_embed_vector).astype('float32')

    # Search for the top k most similar texts using Faiss
    k = 1
    distances, indices = index.search(query_embed_vector, k)

    # Mapping faiss index to database index
    blog_id = id_map[indices[0][0]]
    closest_blog = Blog.objects.get(id=blog_id)

    response_data = {
            "query": query_text,
            "closest_title": closest_blog.blog_title,
            "distance": float(distances[0][0]),  
    }

    return JsonResponse(response_data)