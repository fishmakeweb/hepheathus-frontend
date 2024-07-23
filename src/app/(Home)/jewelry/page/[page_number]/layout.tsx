"use client";
import Link from 'next/link';
import {
  fetchAllAttributes,
  Attributes,
  AttributeSelections,
} from "@/dbutils/jewelryAPI/getAllAtributes";
import React, { useEffect, useState } from "react";

export default function JewelryPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [attributes, setAttributes] = useState<Attributes | null>(null);
  const [selected, setSelected] = useState<AttributeSelections>({
    categories: [],
    materials: [],
    sizes: [],
    shapes: [],
  });
  const [showDropdown, setShowDropdown] = useState({
    categories: false,
    materials: false,
    sizes: false,
    shapes: false,
  });

  const toggleDropdown = (type: keyof typeof showDropdown) => {
    setShowDropdown((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleCheckboxChange = (
    type: keyof AttributeSelections,
    value: number
  ) => {
    setSelected((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((id) => id !== value) // Remove the id if it's already there
        : [...prev[type], value], // Add the id if it's not there
    }));
  };


  const generateQueryParams = () => {
    const params = new URLSearchParams();
    Object.entries(selected).forEach(([key, values]) => {
      if (values.length > 0) {
        params.append(`${key}Ids`, values.join(','));
      }
    });
    return params.toString();
  };

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const fetchedAttributes = await fetchAllAttributes();
        setAttributes(fetchedAttributes);
      } catch (error) {
        console.error("Failed to load attributes:", error);
      }
    };
    loadAttributes();
  }, []);
  return (
    <div className="flex pt-12">
      <div className="w-[15vw] p-4">
        {attributes ? (
          <form>
            <fieldset>
              <legend className="text-lg font-medium text-gray-900">
                Categories
              </legend>
              <div className="space-y-2">
                {attributes.categories.map((category) => (
                  <div key={category.categoryId}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selected.categories.includes(
                          category.categoryId
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            "categories",
                            category.categoryId
                          )
                        }
                      />
                      <span className="ml-2">{category.categoryName}</span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-lg font-medium text-gray-900">
                Materials
              </legend>
              <div className="space-y-2">
                {attributes.materials.map((material) => (
                  <div key={material.materialId}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selected.materials.includes(
                          material.materialId
                        )}
                        onChange={() =>
                          handleCheckboxChange("materials", material.materialId)
                        }
                      />
                      <span className="ml-2">{material.materialName}</span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-lg font-medium text-gray-900">
                Sizes
              </legend>
              <div className="space-y-2">
                {attributes.sizes.map((size) => (
                  <div key={size.sizeId}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selected.sizes.includes(size.sizeId)}
                        onChange={() =>
                          handleCheckboxChange("sizes", size.sizeId)
                        }
                      />
                      <span className="ml-2">{`${size.sizeNumber} (${size.unit})`}</span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-lg font-medium text-gray-900">
                Shapes
              </legend>
              <div className="space-y-2">
                {attributes.shapes.map((shape) => (
                  <div key={shape.shapeId}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selected.shapes.includes(shape.shapeId)}
                        onChange={() =>
                          handleCheckboxChange("shapes", shape.shapeId)
                        }
                      />
                      <span className="ml-2">{shape.shapeDescription}</span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            <Link href={`/jewelry/page/1?${generateQueryParams()}`}>
              <p className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Search
              </p>
            </Link>
          </form>
        ) : (
          <p>Loading filters...</p>
        )}
      </div>
      <div className="w-[85vw]">{children}</div>
    </div>
  );
}
